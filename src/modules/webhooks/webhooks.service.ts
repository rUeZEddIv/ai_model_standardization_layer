import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jobsService: JobsService,
  ) {}

  async handleWebhook(provider: string, payload: any): Promise<any> {
    this.logger.log(`Received webhook from ${provider}`);

    try {
      // Store webhook event
      const webhookEvent = await this.prisma.webhookEvent.create({
        data: {
          jobId: payload.jobId || payload.taskId || 'unknown',
          providerPayload: payload,
          processed: false,
        },
      });

      // Try to find and update job
      const job = await this.prisma.job.findFirst({
        where: {
          OR: [{ id: payload.jobId }, { providerTaskId: payload.taskId }],
        },
      });

      if (job) {
        await this.jobsService.updateJobStatus(job.id, payload);

        await this.prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            jobId: job.id,
            processed: true,
            processedAt: new Date(),
          },
        });

        this.logger.log(`Webhook processed for job ${job.id}`);
      } else {
        this.logger.warn(
          `Job not found for webhook: ${JSON.stringify(payload)}`,
        );
      }

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to process webhook: ${error.message}`);
      throw error;
    }
  }

  async listWebhooks(jobId?: string) {
    return this.prisma.webhookEvent.findMany({
      where: jobId ? { jobId } : undefined,
      orderBy: { receivedAt: 'desc' },
      take: 100,
    });
  }
}
