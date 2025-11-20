import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BaseAIAdapter,
  GenerateResponse,
  WebhookResponse,
} from './base-ai.adapter';

@Injectable()
export class KieAdapter implements BaseAIAdapter {
  private readonly logger = new Logger(KieAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('KIE_API_KEY') || '';
    this.baseUrl =
      this.configService.get<string>('KIE_BASE_URL') || 'https://api.kie.ai';
  }

  getProviderName(): string {
    return 'KIE.AI';
  }

  async generate(payload: any): Promise<GenerateResponse> {
    this.logger.log(
      `Generating content with KIE.AI: ${JSON.stringify(payload)}`,
    );

    try {
      // Map standardized payload to KIE.AI specific format
      const kiePayload = this.mapToKieFormat(payload);

      // Make API call to KIE.AI
      const response = await fetch(
        `${this.baseUrl}${this.getEndpoint(payload.category)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(kiePayload),
        },
      );

      const data = await response.json();

      if (data.code !== 200) {
        throw new Error(data.msg || 'KIE.AI generation failed');
      }

      return {
        taskId: data.data.taskId,
        status: 'PENDING',
        rawResponse: data,
      };
    } catch (error) {
      this.logger.error(`KIE.AI generation error: ${error.message}`);
      throw error;
    }
  }

  async handleWebhook(payload: any): Promise<WebhookResponse> {
    this.logger.log(`Handling KIE.AI webhook: ${JSON.stringify(payload)}`);

    // Map KIE.AI webhook to standardized format
    return {
      taskId: payload.taskId || payload.data?.taskId,
      status: this.mapKieStatus(payload.status || payload.data?.status),
      outputResult: {
        urls:
          payload.data?.imageUrls ||
          payload.data?.videoUrls ||
          payload.data?.audioUrls ||
          [],
        data: payload.data,
      },
      errorMessage: payload.error || payload.msg,
    };
  }

  private mapToKieFormat(payload: any): any {
    const { category, data, model } = payload;

    // Base mapping for common fields
    const kiePayload: any = {
      prompt: data.prompt,
      callBackUrl: data.callbackUrl,
    };

    // Category-specific mappings
    switch (category) {
      case 'text-to-image':
        return {
          ...kiePayload,
          aspectRatio: data.aspectRatio,
          model: model.externalModelId,
          outputFormat: data.outputFormat || 'jpeg',
          enableTranslation: data.enableTranslation !== false,
        };

      case 'image-to-image':
        return {
          ...kiePayload,
          inputImage: data.uploadedImages?.[0],
          aspectRatio: data.aspectRatio,
          model: model.externalModelId,
        };

      case 'text-to-video':
        return {
          ...kiePayload,
          aspectRatio: data.aspectRatio,
          duration: data.duration,
          model: model.externalModelId,
        };

      case 'image-to-video':
        return {
          ...kiePayload,
          inputImage: data.uploadedImages?.[0],
          duration: data.duration,
          aspectRatio: data.aspectRatio,
          model: model.externalModelId,
        };

      default:
        return kiePayload;
    }
  }

  private getEndpoint(category: string): string {
    const endpoints: Record<string, string> = {
      'text-to-image': '/api/v1/flux/kontext/generate',
      'image-to-image': '/api/v1/flux/kontext/generate',
      'text-to-video': '/api/v1/sora/generate',
      'image-to-video': '/api/v1/sora/generate',
    };

    return endpoints[category] || '/api/v1/generate';
  }

  private mapKieStatus(
    kieStatus: any,
  ): 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' {
    if (typeof kieStatus === 'string') {
      const status = kieStatus.toLowerCase();
      if (status.includes('complete') || status.includes('success'))
        return 'COMPLETED';
      if (status.includes('process') || status.includes('running'))
        return 'PROCESSING';
      if (status.includes('fail') || status.includes('error')) return 'FAILED';
    }
    return 'PENDING';
  }
}
