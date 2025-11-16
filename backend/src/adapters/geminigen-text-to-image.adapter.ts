import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ITextToImageStrategy, GenerationResult } from '../interfaces';
import { TextToImageDto } from '../dto';

@Injectable()
export class GeminigenTextToImageAdapter implements ITextToImageStrategy {
  private readonly logger = new Logger(GeminigenTextToImageAdapter.name);

  constructor(private readonly httpService: HttpService) {}

  async generate(
    dto: TextToImageDto,
    apiKey: string,
  ): Promise<GenerationResult> {
    this.logger.log(
      `Generating image with Geminigen.ai for prompt: ${dto.prompt}`,
    );

    try {
      // Transform standard DTO to Geminigen.ai proprietary format
      const geminigenPayload = this.transformToGeminigenFormat(dto);

      // Example: Call Geminigen.ai API (URL would come from AiModel entity)
      // const response = await firstValueFrom(
      //   this.httpService.post(
      //     'https://api.geminigen.ai/v1/image/generate',
      //     geminigenPayload,
      //     {
      //       headers: {
      //         'X-API-Key': apiKey,
      //         'Content-Type': 'application/json',
      //       },
      //     },
      //   ),
      // );

      // Simulated response for demonstration
      const simulatedResponse = {
        task_id: `geminigen-${Date.now()}`,
        state: 'queued',
      };

      // Transform Geminigen.ai response to standard format
      return this.transformFromGeminigenFormat(simulatedResponse);
    } catch (error) {
      this.logger.error(
        `Error generating image with Geminigen.ai: ${error.message}`,
      );
      throw error;
    }
  }

  async handleWebhook(payload: any): Promise<GenerationResult> {
    this.logger.log(
      `Handling webhook from Geminigen.ai: ${JSON.stringify(payload)}`,
    );

    // Transform Geminigen.ai webhook payload to standard format
    return {
      jobId: payload.task_id,
      status: payload.state === 'completed' ? 'COMPLETED' : 'PENDING',
      outputs: payload.images?.map((image: any) => ({
        type: 'IMAGE' as const,
        url: image.image_url,
      })),
    };
  }

  private transformToGeminigenFormat(dto: TextToImageDto): any {
    // Transform standard DTO to Geminigen.ai proprietary format
    const [width, height] = this.parseResolution(dto.resolution || '1024x1024');

    return {
      text_prompt: dto.prompt,
      width,
      height,
      seed: dto.seed,
      batch_size: dto.numberOfGenerations || 1,
      // Add other Geminigen.ai specific parameters
    };
  }

  private transformFromGeminigenFormat(
    geminigenResponse: any,
  ): GenerationResult {
    // Transform Geminigen.ai response to standard format
    if (geminigenResponse.state === 'completed') {
      return {
        status: 'COMPLETED',
        outputs: geminigenResponse.images?.map((image: any) => ({
          type: 'IMAGE' as const,
          url: image.image_url,
        })),
      };
    }

    return {
      status: 'PENDING',
      providerJobId: geminigenResponse.task_id,
      message: 'Job submitted to Geminigen.ai, awaiting callback',
    };
  }

  private parseResolution(resolution: string): [number, number] {
    const [width, height] = resolution.split('x').map(Number);
    return [width || 1024, height || 1024];
  }
}
