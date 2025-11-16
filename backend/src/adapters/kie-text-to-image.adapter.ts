import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ITextToImageStrategy, GenerationResult } from '../interfaces';
import { TextToImageDto } from '../dto';

@Injectable()
export class KieTextToImageAdapter implements ITextToImageStrategy {
  private readonly logger = new Logger(KieTextToImageAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  async generate(
    dto: TextToImageDto,
    apiKey: string,
  ): Promise<GenerationResult> {
    this.logger.log(`Generating image with Kie.ai for prompt: ${dto.prompt}`);

    try {
      // Transform standard DTO to Kie.ai proprietary format
      const kiePayload = this.transformToKieFormat(dto);

      // Example: Call Kie.ai API (URL would come from AiModel entity)
      // const response = await firstValueFrom(
      //   this.httpService.post(
      //     'https://api.kie.ai/v1/generate/image',
      //     kiePayload,
      //     {
      //       headers: {
      //         'Authorization': `Bearer ${apiKey}`,
      //         'Content-Type': 'application/json',
      //       },
      //     },
      //   ),
      // );

      // Simulated response for demonstration
      const simulatedResponse = {
        job_id: `kie-${Date.now()}`,
        status: 'processing',
      };

      // Transform Kie.ai response to standard format
      return this.transformFromKieFormat(simulatedResponse);
    } catch (error) {
      this.logger.error(`Error generating image with Kie.ai: ${error.message}`);
      throw error;
    }
  }

  async handleWebhook(payload: any): Promise<GenerationResult> {
    this.logger.log(`Handling webhook from Kie.ai: ${JSON.stringify(payload)}`);

    // Transform Kie.ai webhook payload to standard format
    return {
      jobId: payload.job_id,
      status: payload.status === 'completed' ? 'COMPLETED' : 'PENDING',
      outputs: payload.results?.map((result: any) => ({
        type: 'IMAGE' as const,
        url: result.url,
      })),
    };
  }

  private transformToKieFormat(dto: TextToImageDto): any {
    // Transform standard DTO to Kie.ai proprietary format
    return {
      prompt: dto.prompt,
      aspect_ratio: dto.aspectRatio || '1:1',
      resolution: dto.resolution || '1024x1024',
      seed: dto.seed,
      num_outputs: dto.numberOfGenerations || 1,
      // Add other Kie.ai specific parameters
    };
  }

  private transformFromKieFormat(kieResponse: any): GenerationResult {
    // Transform Kie.ai response to standard format
    if (kieResponse.status === 'completed') {
      return {
        status: 'COMPLETED',
        outputs: kieResponse.results?.map((result: any) => ({
          type: 'IMAGE' as const,
          url: result.url,
        })),
      };
    }

    return {
      status: 'PENDING',
      providerJobId: kieResponse.job_id,
      message: 'Job submitted to Kie.ai, awaiting callback',
    };
  }
}
