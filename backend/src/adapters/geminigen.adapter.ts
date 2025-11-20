import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BaseAIAdapter,
  GenerateResponse,
  WebhookResponse,
} from './base-ai.adapter';

@Injectable()
export class GeminiGenAdapter implements BaseAIAdapter {
  private readonly logger = new Logger(GeminiGenAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINIGEN_API_KEY') || '';
    this.baseUrl =
      this.configService.get<string>('GEMINIGEN_BASE_URL') ||
      'https://api.geminigen.ai';
  }

  getProviderName(): string {
    return 'GEMINIGEN.AI';
  }

  async generate(payload: any): Promise<GenerateResponse> {
    this.logger.log(
      `Generating content with GeminiGen.AI: ${JSON.stringify(payload)}`,
    );

    try {
      // Map standardized payload to GeminiGen.AI specific format
      const geminiPayload = this.mapToGeminiFormat(payload);

      // Make API call to GeminiGen.AI
      const response = await fetch(
        `${this.baseUrl}${this.getEndpoint(payload.category)}`,
        {
          method: 'POST',
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(geminiPayload),
        },
      );

      const data = await response.json();

      if (!data.success && !data.uuid) {
        throw new Error(data.error_message || 'GeminiGen.AI generation failed');
      }

      return {
        taskId: data.uuid || data.result?.uuid,
        status: 'PENDING',
        rawResponse: data,
      };
    } catch (error) {
      this.logger.error(`GeminiGen.AI generation error: ${error.message}`);
      throw error;
    }
  }

  async handleWebhook(payload: any): Promise<WebhookResponse> {
    this.logger.log(
      `Handling GeminiGen.AI webhook: ${JSON.stringify(payload)}`,
    );

    // Map GeminiGen.AI webhook to standardized format
    return {
      taskId: payload.uuid || payload.id,
      status: this.mapGeminiStatus(payload.status),
      outputResult: {
        urls: [payload.generate_result].filter(Boolean),
        data: payload,
      },
      errorMessage: payload.error_message,
    };
  }

  private mapToGeminiFormat(payload: any): any {
    const { category, data, model } = payload;

    // Category-specific mappings
    switch (category) {
      case 'text-to-image':
        return {
          prompt: data.prompt,
          model: model.externalModelId,
          aspect_ratio: data.aspectRatio || '1:1',
          style: data.style || 'None',
          service_mode: 'unstable',
        };

      case 'text-to-video':
        return {
          prompt: data.prompt,
          model: model.externalModelId,
          aspect_ratio: data.aspectRatio || '16:9',
          duration: data.duration || 5,
        };

      case 'text-to-speech':
        return {
          model: model.externalModelId,
          voices: data.voices || [
            {
              name: 'Default',
              voice: { id: data.voiceId, name: 'Default' },
            },
          ],
          speed: data.speed || 1,
          input: data.text,
          output_format: data.outputFormat || 'mp3',
        };

      case 'text-to-speech-multi':
        return {
          model: model.externalModelId,
          voices: data.speakers.map((speaker: any) => ({
            name: speaker.name || 'Speaker',
            voice: { id: speaker.voiceId, name: speaker.name || 'Speaker' },
          })),
          speed: data.speed || 1,
          input: data.speakers.map((s: any) => s.text).join('\n'),
          output_format: data.outputFormat || 'mp3',
        };

      default:
        return {
          prompt: data.prompt,
          model: model.externalModelId,
        };
    }
  }

  private getEndpoint(category: string): string {
    const endpoints: Record<string, string> = {
      'text-to-image': '/uapi/v1/generate_image',
      'text-to-video': '/uapi/v1/generate_video',
      'text-to-speech': '/uapi/v1/text-to-speech',
      'text-to-speech-multi': '/uapi/v1/text-to-speech',
      'speech-to-text': '/uapi/v1/speech-to-text',
    };

    return endpoints[category] || '/uapi/v1/generate';
  }

  private mapGeminiStatus(
    geminiStatus: number,
  ): 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' {
    switch (geminiStatus) {
      case 1:
        return 'PROCESSING';
      case 2:
        return 'COMPLETED';
      case 3:
        return 'FAILED';
      default:
        return 'PENDING';
    }
  }
}
