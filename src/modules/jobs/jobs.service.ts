import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { JobStatus, GenerationCategory } from '@prisma/client';
import { AdapterFactory } from '../../providers/adapters/adapter.factory';
import { ApiKeysService } from '../api-keys/api-keys.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly adapterFactory: AdapterFactory,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async createJob(
    modelId: string,
    category: GenerationCategory,
    requestData: any,
  ): Promise<any> {
    // Get model with provider info
    const model = await this.prisma.aiModel.findUnique({
      where: { id: modelId },
      include: { provider: true },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    // Create job record
    const job = await this.prisma.job.create({
      data: {
        providerId: model.providerId,
        modelId,
        category,
        requestData,
        status: JobStatus.PENDING,
      },
      include: {
        provider: true,
        model: true,
      },
    });

    // Process job asynchronously
    this.processJob(job).catch((error) => {
      this.logger.error(`Failed to process job ${job.id}: ${error.message}`);
    });

    return job;
  }

  private async processJob(job: any): Promise<void> {
    let apiKey: any;
    let attempt = 0;
    const maxAttempts = job.maxRetries;

    while (attempt < maxAttempts) {
      try {
        // Get adapter for provider
        const adapter = this.adapterFactory.getAdapter(job.provider.slug);

        // Get active API key
        apiKey = await this.apiKeysService.getActiveKey(job.providerId);

        // Update job status
        await this.prisma.job.update({
          where: { id: job.id },
          data: {
            status: JobStatus.PROCESSING,
            apiKeyId: apiKey.id,
            startedAt: new Date(),
          },
        });

        // Map request to provider format
        const mappedRequest = adapter.mapRequest(job.category, job.requestData);

        // Update with mapped request
        await this.prisma.job.update({
          where: { id: job.id },
          data: { providerRequest: mappedRequest },
        });

        // Submit to provider
        const providerResponse = await adapter.submitGeneration(
          job.category,
          mappedRequest,
          apiKey.key,
        );

        // Map response
        const mappedResponse = adapter.mapResponse(
          job.category,
          providerResponse,
        );

        // Update job with response
        await this.prisma.job.update({
          where: { id: job.id },
          data: {
            providerResponse,
            responseData: mappedResponse,
            providerTaskId: mappedResponse.taskId,
            status:
              mappedResponse.status === 'COMPLETED'
                ? JobStatus.COMPLETED
                : JobStatus.PROCESSING,
            completedAt:
              mappedResponse.status === 'COMPLETED' ? new Date() : null,
            resultUrl: mappedResponse.resultUrl,
            thumbnailUrl: mappedResponse.thumbnailUrl,
          },
        });

        // Reset error count on success
        await this.apiKeysService.resetErrorCount(apiKey.id);

        this.logger.log(`Job ${job.id} submitted successfully`);
        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          `Job ${job.id} attempt ${attempt}/${maxAttempts} failed: ${error.message}`,
        );

        // Mark API key as error
        if (apiKey) {
          if (
            error.message.includes('rate limit') ||
            error.message.includes('429')
          ) {
            await this.apiKeysService.markKeyAsRateLimited(apiKey.id);
          } else {
            await this.apiKeysService.markKeyAsError(apiKey.id, error.message);
          }
        }

        if (attempt >= maxAttempts) {
          // Mark job as failed
          await this.prisma.job.update({
            where: { id: job.id },
            data: {
              status: JobStatus.FAILED,
              errorMessage: error.message,
              retryCount: attempt,
              completedAt: new Date(),
            },
          });
          throw error;
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  async getJob(jobId: string): Promise<any> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        provider: true,
        model: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return job;
  }

  async updateJobStatus(jobId: string, webhookData: any): Promise<any> {
    const job = await this.getJob(jobId);
    const adapter = this.adapterFactory.getAdapter(job.provider.slug);

    // Map webhook data to standard format
    const mappedData = adapter.mapWebhook(webhookData);

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        status:
          mappedData.status === 'COMPLETED'
            ? JobStatus.COMPLETED
            : mappedData.status === 'FAILED'
              ? JobStatus.FAILED
              : JobStatus.PROCESSING,
        responseData: mappedData,
        resultUrl: mappedData.resultUrl,
        thumbnailUrl: mappedData.thumbnailUrl,
        errorMessage: mappedData.errorMessage,
        errorCode: mappedData.errorCode,
        completedAt:
          mappedData.status === 'COMPLETED' || mappedData.status === 'FAILED'
            ? new Date()
            : null,
      },
    });
  }

  async listJobs(filters?: {
    status?: JobStatus;
    category?: GenerationCategory;
    limit?: number;
  }): Promise<any[]> {
    return this.prisma.job.findMany({
      where: {
        status: filters?.status,
        category: filters?.category,
      },
      include: {
        provider: true,
        model: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 100,
    });
  }
}
