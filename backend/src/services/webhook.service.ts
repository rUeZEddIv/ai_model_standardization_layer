import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenerationJob, GeneratedOutput } from '../entities';
import { JobStatus, OutputType } from '../enums';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(GenerationJob)
    private readonly jobRepository: Repository<GenerationJob>,
    @InjectRepository(GeneratedOutput)
    private readonly outputRepository: Repository<GeneratedOutput>,
  ) {}

  async handleProviderCallback(jobId: string, payload: any): Promise<void> {
    this.logger.log(`Handling webhook callback for job ${jobId}`);

    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['model', 'model.provider'],
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    // Update job status based on webhook payload
    if (payload.status === 'completed' || payload.state === 'completed') {
      job.status = JobStatus.COMPLETED;
      job.outputPayload = payload;

      // Create output records
      const outputs = payload.results || payload.images || [];
      for (const output of outputs) {
        const generatedOutput = this.outputRepository.create({
          jobId: job.id,
          type: this.determineOutputType(job.model.generationCategory),
          url: output.url || output.image_url,
          isPublic: job.isPublic,
        });
        await this.outputRepository.save(generatedOutput);
      }
    } else if (payload.status === 'failed' || payload.state === 'failed') {
      job.status = JobStatus.FAILED;
      job.errorMessage =
        payload.error || payload.error_message || 'Generation failed';
    } else {
      job.status = JobStatus.PROCESSING;
    }

    await this.jobRepository.save(job);
    this.logger.log(`Job ${jobId} updated to status ${job.status}`);
  }

  private determineOutputType(category: string): OutputType {
    if (category.includes('IMAGE')) return OutputType.IMAGE;
    if (category.includes('VIDEO')) return OutputType.VIDEO;
    if (category.includes('MUSIC') || category.includes('SPEECH'))
      return OutputType.AUDIO;
    return OutputType.TEXT;
  }
}
