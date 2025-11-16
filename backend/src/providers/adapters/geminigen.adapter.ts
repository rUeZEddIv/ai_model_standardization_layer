import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  AIProviderAdapter,
  StandardizedInput,
  StandardizedOutput,
  ProviderResponse,
  TaskStatus,
  WebhookData,
  ValidationResult,
} from '../interfaces/provider-adapter.interface';

@Injectable()
export class GeminiGenAdapter implements AIProviderAdapter {
  private readonly logger = new Logger(GeminiGenAdapter.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string;
  private apiKeys: string[];
  private currentKeyIndex = 0;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('providers.geminigen.baseUrl') || 'https://api.geminigen.ai';
    this.apiKeys = this.configService.get<string[]>('providers.geminigen.apiKeys') || [];

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private getNextApiKey(): string {
    if (!this.apiKeys || this.apiKeys.length === 0) {
      throw new Error('No GeminiGen.AI API keys configured');
    }
    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    return key;
  }

  async createTask(input: StandardizedInput): Promise<ProviderResponse> {
    try {
      const apiKey = this.getNextApiKey();
      const providerInput = this.mapInputToProvider(input);
      const endpoint = this.getEndpointForCategory(input.category);

      this.logger.log(`Creating GeminiGen.AI task: ${JSON.stringify(providerInput)}`);

      const response = await this.axiosInstance.post(endpoint, providerInput, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      this.logger.log(`GeminiGen.AI response: ${JSON.stringify(response.data)}`);

      return {
        taskId: response.data.taskId || response.data.id,
        status: 'pending',
        raw: response.data,
      };
    } catch (error) {
      this.logger.error('GeminiGen.AI createTask error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    try {
      const apiKey = this.getNextApiKey();

      const response = await this.axiosInstance.get(
        `/uapi/v1/task-status/${taskId}`,
        {
          headers: {
            'x-api-key': apiKey,
          },
        },
      );

      const data = response.data;
      const status = this.mapProviderStatus(data.status);

      return {
        status,
        progress: data.progress,
        results: data.outputs || data.result ? [data.outputs || data.result] : [],
        error: data.error,
      };
    } catch (error) {
      this.logger.error('GeminiGen.AI getTaskStatus error:', error.response?.data || error.message);
      throw error;
    }
  }

  handleWebhook(payload: any): WebhookData {
    this.logger.log(`GeminiGen.AI webhook received: ${JSON.stringify(payload)}`);

    return {
      taskId: payload.taskId || payload.id,
      status: this.mapProviderStatus(payload.status),
      results: payload.outputs || payload.result ? [payload.outputs || payload.result] : [],
      error: payload.error,
    };
  }

  validateInput(input: any): ValidationResult {
    const errors: string[] = [];

    if (!input.text && !input.prompt && !input.uploadedImage) {
      errors.push('Either text, prompt, or uploadedImage is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  mapInputToProvider(input: StandardizedInput): any {
    const { category, input: formInput, webhookUrl } = input;

    const providerInput: any = {};

    // Map based on category
    if (category.includes('text-to-speech') || category.includes('speech')) {
      providerInput.text = formInput.text || formInput.prompt;
      providerInput.voiceId = formInput.voiceId;
      providerInput.language = formInput.language;
      providerInput.speed = formInput.speed || 1.0;
      providerInput.outputFormat = formInput.outputFormat || 'mp3';
      
      if (formInput.speakers) {
        providerInput.speakers = formInput.speakers;
      }
    } else if (category.includes('image')) {
      providerInput.prompt = formInput.prompt;
      providerInput.model = formInput.aiModelId;
      providerInput.aspectRatio = formInput.aspectRatio;
      providerInput.style = formInput.style;
      providerInput.serviceMode = formInput.serviceMode;
      providerInput.numberOfGenerations = formInput.numberOfGenerations || 1;
    } else if (category.includes('video')) {
      providerInput.prompt = formInput.prompt;
      providerInput.duration = formInput.duration;
      providerInput.aspectRatio = formInput.aspectRatio;
      providerInput.serviceMode = formInput.serviceMode;
      
      if (formInput.uploadedImages) {
        providerInput.imageUrl = formInput.uploadedImages[0];
      }
    }

    if (webhookUrl) {
      providerInput.webhookUrl = webhookUrl;
    }

    return providerInput;
  }

  mapOutputFromProvider(output: any): StandardizedOutput {
    return {
      taskId: output.taskId || output.id,
      status: this.mapProviderStatus(output.status),
      results: output.outputs || output.result
        ? [
            {
              fileUrl: output.outputs?.url || output.result?.url,
              fileType: this.inferFileType(output.outputs?.url || output.result?.url),
              metadata: output.metadata,
            },
          ]
        : [],
      error: output.error,
      createdAt: new Date(output.createdAt || Date.now()),
      updatedAt: new Date(output.updatedAt || Date.now()),
      completedAt: output.completedAt ? new Date(output.completedAt) : undefined,
    };
  }

  private getEndpointForCategory(category: string): string {
    const endpoints: Record<string, string> = {
      'text-to-speech': '/uapi/v1/text-to-speech',
      'text-to-speech-multiple': '/uapi/v1/tts-multi-speaker',
      'speech-to-text': '/uapi/v1/speech-to-text',
      'document-to-speech': '/uapi/v1/document-to-speech',
      'text-to-image': '/uapi/v1/generate_image',
      'text-to-video': '/uapi/v1/video-gen/veo',
      'image-to-video': '/uapi/v1/video-gen/veo',
    };

    return endpoints[category] || '/uapi/v1/generate';
  }

  private mapProviderStatus(status: string): 'pending' | 'processing' | 'completed' | 'failed' {
    const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
      pending: 'pending',
      queued: 'pending',
      processing: 'processing',
      running: 'processing',
      completed: 'completed',
      success: 'completed',
      done: 'completed',
      failed: 'failed',
      error: 'failed',
    };

    return statusMap[status?.toLowerCase()] || 'pending';
  }

  private inferFileType(url: string): string {
    if (!url) return 'unknown';
    const ext = url.split('.').pop()?.toLowerCase();
    if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext && ['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
    if (ext && ['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    return 'unknown';
  }
}
