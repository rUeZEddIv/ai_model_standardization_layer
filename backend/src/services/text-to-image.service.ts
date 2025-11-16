import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerationJob, UserProviderCredential } from '../entities';
import { JobStatus } from '../enums';
import { TextToImageDto } from '../dto';
import { ITextToImageStrategy, GenerationResult } from '../interfaces';
import { ModelsService } from './models.service';
import {
  KieTextToImageAdapter,
  GeminigenTextToImageAdapter,
} from '../adapters';

@Injectable()
export class TextToImageService {
  private readonly logger = new Logger(TextToImageService.name);
  private readonly adapters: Map<string, ITextToImageStrategy>;

  constructor(
    @InjectRepository(GenerationJob)
    private readonly jobRepository: Repository<GenerationJob>,
    @InjectRepository(UserProviderCredential)
    private readonly credentialRepository: Repository<UserProviderCredential>,
    private readonly modelsService: ModelsService,
    private readonly kieAdapter: KieTextToImageAdapter,
    private readonly geminigenAdapter: GeminigenTextToImageAdapter,
  ) {
    // Register adapters by provider name
    this.adapters = new Map();
    this.adapters.set('Kie.ai', this.kieAdapter);
    this.adapters.set('Geminigen.ai', this.geminigenAdapter);
  }

  async generate(userId: string, dto: TextToImageDto): Promise<any> {
    this.logger.log(`Processing text-to-image request for user ${userId}`);

    // Get AI Model
    const model = await this.modelsService.findById(dto.aiModelId);

    // Get user's API key for this provider
    const credential = await this.credentialRepository.findOne({
      where: {
        userId,
        providerId: model.providerId,
      },
    });

    if (!credential) {
      throw new BadRequestException(
        `No API credentials found for provider ${model.provider.name}. Please add your API key first.`,
      );
    }

    // Get the appropriate adapter
    const adapter = this.adapters.get(model.provider.name);
    if (!adapter) {
      throw new BadRequestException(
        `No adapter available for provider ${model.provider.name}`,
      );
    }

    // Create job record
    const job = this.jobRepository.create({
      userId,
      modelId: model.id,
      status: JobStatus.PENDING,
      inputPayload: dto,
      isPublic: dto.isPublic || false,
    });
    await this.jobRepository.save(job);

    try {
      // Call the adapter to generate
      const result = await adapter.generate(dto, credential.apiKey);

      // Update job with result
      job.status =
        result.status === 'COMPLETED'
          ? JobStatus.COMPLETED
          : JobStatus.PROCESSING;
      if (result.providerJobId) {
        job.providerJobId = result.providerJobId;
      }
      job.outputPayload = result.outputs;
      await this.jobRepository.save(job);

      return {
        jobId: job.id,
        status: job.status,
        providerJobId: result.providerJobId,
        outputs: result.outputs,
        message: result.message,
      };
    } catch (error) {
      // Update job with error
      job.status = JobStatus.FAILED;
      job.errorMessage = error.message;
      await this.jobRepository.save(job);
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<GenerationJob> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['model', 'outputs'],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    return job;
  }
}
