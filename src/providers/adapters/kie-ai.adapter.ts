import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BaseAdapter } from './base.adapter';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KieAiAdapter extends BaseAdapter {
  private readonly baseUrl = 'https://api.kie.ai/api/v1';

  constructor(httpService: HttpService) {
    super(httpService);
  }

  getProviderName(): string {
    return 'kie.ai';
  }

  protected getHeaders(apiKey: string): Record<string, string> {
    return {
      Authorization: `Bearer ${apiKey}`,
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
      default:
        throw new Error(`Unsupported category: ${category}`);
    }
  }

  private mapTextToImageRequest(req: any): any {
    return {
      prompt: req.prompt,
      aspectRatio: req.aspectRatio || '16:9',
      model: 'flux-kontext-pro', // Default model
      enableTranslation: true,
      outputFormat: 'jpeg',
      promptUpsampling: false,
      safetyTolerance: 2,
    };
  }

  private mapImageToImageRequest(req: any): any {
    const baseRequest = this.mapTextToImageRequest(req);
    return {
      ...baseRequest,
      inputImage: req.uploadedImages?.[0], // Use first image
    };
  }

  private mapTextToVideoRequest(req: any): any {
    // KieAI uses different endpoints for video - this is a placeholder
    return {
      prompt: req.prompt,
      aspectRatio: req.aspectRatio || '16:9',
      duration: req.duration || 5,
    };
  }

  private mapImageToVideoRequest(req: any): any {
    const baseRequest = this.mapTextToVideoRequest(req);
    return {
      ...baseRequest,
      inputImage: req.uploadedImages?.[0],
    };
  }

  mapResponse(category: string, providerResponse: any): any {
    // Standardize KieAI response format
    return {
      taskId: providerResponse.data?.taskId || providerResponse.taskId,
      status: this.mapStatus(providerResponse.data?.successFlag),
      statusPercentage: this.getStatusPercentage(
        providerResponse.data?.successFlag,
      ),
      resultUrl:
        providerResponse.data?.response?.resultImageUrl ||
        providerResponse.data?.response?.resultVideoUrl,
      thumbnailUrl: providerResponse.data?.response?.thumbnailUrl,
      errorMessage: providerResponse.data?.errorMessage,
      errorCode: providerResponse.data?.errorCode,
    };
  }

  mapWebhook(webhookPayload: any): any {
    return {
      taskId: webhookPayload.data?.taskId,
      status: this.mapStatus(webhookPayload.data?.info?.successFlag),
      statusPercentage: this.getStatusPercentage(
        webhookPayload.data?.info?.successFlag,
      ),
      resultUrl:
        webhookPayload.data?.info?.resultImageUrl ||
        webhookPayload.data?.info?.resultVideoUrl,
      errorMessage: webhookPayload.data?.info?.errorMessage,
      errorCode: webhookPayload.data?.info?.errorCode,
    };
  }

  private mapStatus(successFlag: number): string {
    switch (successFlag) {
      case 0:
        return 'PROCESSING';
      case 1:
        return 'COMPLETED';
      case 2:
      case 3:
        return 'FAILED';
      default:
        return 'PENDING';
    }
  }

  private getStatusPercentage(successFlag: number): number {
    switch (successFlag) {
      case 0:
        return 50;
      case 1:
        return 100;
      case 2:
      case 3:
        return 0;
      default:
        return 0;
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
        this.httpService.get(
          `${this.baseUrl}/flux/kontext/record-info?taskId=${taskId}`,
          { headers: this.getHeaders(apiKey) },
        ),
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
        return '/flux/kontext/generate';
      case 'TEXT_TO_VIDEO':
      case 'IMAGE_TO_VIDEO':
        return '/runway/generate'; // Placeholder
      default:
        throw new Error(`Unsupported category: ${category}`);
    }
  }

  async getSupportedModels(): Promise<any[]> {
    return [
      {
        name: 'Flux Kontext Pro',
        slug: 'flux-kontext-pro',
        category: 'TEXT_TO_IMAGE',
        capabilities: {
          aspectRatios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
          outputFormats: ['jpeg', 'png'],
        },
      },
      {
        name: 'Flux Kontext Max',
        slug: 'flux-kontext-max',
        category: 'TEXT_TO_IMAGE',
        capabilities: {
          aspectRatios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
          outputFormats: ['jpeg', 'png'],
        },
      },
    ];
  }
}
