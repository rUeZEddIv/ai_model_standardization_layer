import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BaseAdapter } from './base.adapter';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeminiGenAdapter extends BaseAdapter {
  private readonly baseUrl = 'https://api.geminigen.ai/uapi/v1';

  constructor(httpService: HttpService) {
    super(httpService);
  }

  getProviderName(): string {
    return 'geminigen.ai';
  }

  protected getHeaders(apiKey: string): Record<string, string> {
    return {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    };
  }

  mapRequest(category: string, standardizedRequest: any): any {
    switch (category) {
      case 'TEXT_TO_IMAGE':
        return this.mapTextToImageRequest(standardizedRequest);
      case 'IMAGE_TO_IMAGE':
        return this.mapImageToImageRequest(standardizedRequest);
      case 'TEXT_TO_VIDEO':
        return this.mapTextToVideoRequest(standardizedRequest);
      case 'IMAGE_TO_VIDEO':
        return this.mapImageToVideoRequest(standardizedRequest);
      case 'TEXT_TO_SPEECH_SINGLE':
      case 'TEXT_TO_SPEECH_MULTI':
        return this.mapTextToSpeechRequest(standardizedRequest);
      default:
        throw new Error(`Unsupported category: ${category}`);
    }
  }

  private mapTextToImageRequest(req: any): any {
    return {
      prompt: req.prompt,
      model: 'imagen-4',
      aspect_ratio: req.aspectRatio || '1:1',
      style: 'Photorealistic',
      service_mode: 'unstable',
    };
  }

  private mapImageToImageRequest(req: any): any {
    const baseRequest = this.mapTextToImageRequest(req);
    return {
      ...baseRequest,
      files: req.uploadedImages || [],
    };
  }

  private mapTextToVideoRequest(req: any): any {
    return {
      prompt: req.prompt,
      model: 'veo-2',
      resolution: req.resolution || '720p',
      duration: req.duration || 8,
      aspect_ratio: req.aspectRatio || '16:9',
      service_mode: 'unstable',
    };
  }

  private mapImageToVideoRequest(req: any): any {
    const baseRequest = this.mapTextToVideoRequest(req);
    return {
      ...baseRequest,
      files: req.uploadedImages || [],
    };
  }

  private mapTextToSpeechRequest(req: any): any {
    const voices = req.speakers
      ? req.speakers.map((speaker: any) => ({
          name: speaker.voiceId,
          voice: {
            id: speaker.voiceId,
            name: speaker.voiceId,
          },
        }))
      : [
          {
            name: req.voiceId || 'Gacrux',
            voice: {
              id: req.voiceId || 'GM013',
              name: req.voiceId || 'Gacrux',
            },
          },
        ];

    return {
      model: 'tts-flash',
      voices: voices,
      speed: 1,
      input: req.text || req.speakers?.map((s: any) => s.text).join(' '),
      output_format: 'mp3',
    };
  }

  mapResponse(category: string, providerResponse: any): any {
    return {
      taskId: providerResponse.uuid || providerResponse.id,
      status: this.mapStatus(providerResponse.status),
      statusPercentage: providerResponse.status_percentage || 0,
      resultUrl: providerResponse.generate_result,
      thumbnailUrl: providerResponse.thumbnail_small,
      errorMessage: providerResponse.error_message,
      errorCode: providerResponse.error_code,
    };
  }

  mapWebhook(webhookPayload: any): any {
    return {
      taskId: webhookPayload.uuid || webhookPayload.id,
      status: this.mapStatus(webhookPayload.status),
      statusPercentage: webhookPayload.status_percentage || 0,
      resultUrl: webhookPayload.generate_result,
      thumbnailUrl: webhookPayload.thumbnail_small,
      errorMessage: webhookPayload.error_message,
      errorCode: webhookPayload.error_code,
    };
  }

  private mapStatus(status: number): string {
    switch (status) {
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

  async submitGeneration(
    category: string,
    mappedRequest: any,
    apiKey: string,
  ): Promise<any> {
    try {
      const endpoint = this.getEndpoint(category);
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}${endpoint}`, mappedRequest, {
          headers: this.getHeaders(apiKey),
        }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getStatus(taskId: string, apiKey: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/generation/${taskId}`, {
          headers: this.getHeaders(apiKey),
        }),
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private getEndpoint(category: string): string {
    switch (category) {
      case 'TEXT_TO_IMAGE':
      case 'IMAGE_TO_IMAGE':
        return '/generate_image';
      case 'TEXT_TO_VIDEO':
      case 'IMAGE_TO_VIDEO':
        return '/video-gen/veo';
      case 'TEXT_TO_SPEECH_SINGLE':
      case 'TEXT_TO_SPEECH_MULTI':
        return '/text-to-speech';
      default:
        throw new Error(`Unsupported category: ${category}`);
    }
  }

  async getSupportedModels(): Promise<any[]> {
    return [
      {
        name: 'Imagen 4',
        slug: 'imagen-4',
        category: 'TEXT_TO_IMAGE',
        capabilities: {
          aspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
          styles: ['Photorealistic', '3D Render', 'Anime General', 'Creative'],
        },
      },
      {
        name: 'Veo 2',
        slug: 'veo-2',
        category: 'TEXT_TO_VIDEO',
        capabilities: {
          aspectRatios: ['16:9', '9:16'],
          resolutions: ['720p', '1080p'],
          durations: [8],
        },
      },
      {
        name: 'TTS Flash',
        slug: 'tts-flash',
        category: 'TEXT_TO_SPEECH_SINGLE',
        capabilities: {
          outputFormats: ['mp3', 'wav'],
        },
      },
    ];
  }
}
