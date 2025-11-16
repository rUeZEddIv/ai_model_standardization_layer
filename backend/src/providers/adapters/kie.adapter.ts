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
export class KieAdapter implements AIProviderAdapter {
  private readonly logger = new Logger(KieAdapter.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string;
  private apiKeys: string[];
  private currentKeyIndex = 0;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('providers.kie.baseUrl') || 'https://api.kie.ai';
    this.apiKeys = this.configService.get<string[]>('providers.kie.apiKeys') || [];

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
      throw new Error('No KIE.AI API keys configured');
    }
    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    return key;
  }

  async createTask(input: StandardizedInput): Promise<ProviderResponse> {
    try {
      const apiKey = this.getNextApiKey();
      const providerInput = this.mapInputToProvider(input);

      this.logger.log(`Creating KIE.AI task: ${JSON.stringify(providerInput)}`);

      const response = await this.axiosInstance.post(
        '/api/v1/jobs/createTask',
        providerInput,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      this.logger.log(`KIE.AI response: ${JSON.stringify(response.data)}`);

      return {
        taskId: response.data.data?.taskId || response.data.taskId,
        status: 'pending',
        raw: response.data,
      };
    } catch (error) {
      this.logger.error('KIE.AI createTask error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    try {
      const apiKey = this.getNextApiKey();

      const response = await this.axiosInstance.get(
        `/api/v1/jobs/recordInfo?taskId=${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      const data = response.data.data || response.data;
      const status = this.mapProviderStatus(data.status);

      return {
        status,
        progress: data.progress,
        results: data.results || data.outputUrl ? [{ url: data.outputUrl }] : [],
        error: data.error || data.errorMessage,
      };
    } catch (error) {
      this.logger.error('KIE.AI getTaskStatus error:', error.response?.data || error.message);
      throw error;
    }
  }

  handleWebhook(payload: any): WebhookData {
    this.logger.log(`KIE.AI webhook received: ${JSON.stringify(payload)}`);

    return {
      taskId: payload.taskId,
      status: this.mapProviderStatus(payload.status),
      results: payload.outputUrl ? [{ url: payload.outputUrl }] : [],
      error: payload.error || payload.errorMessage,
    };
  }

  validateInput(input: any): ValidationResult {
    const errors: string[] = [];

    if (!input.prompt && !input.uploadedImage) {
      errors.push('Either prompt or uploadedImage is required');
    }

    if (input.prompt && typeof input.prompt !== 'string') {
      errors.push('Prompt must be a string');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  mapInputToProvider(input: StandardizedInput): any {
    const { aiModelId, input: formInput, webhookUrl } = input;

    // Base structure for KIE.AI
    const providerInput: any = {
      modelId: aiModelId,
      callBackUrl: webhookUrl,
    };

    // Map common fields
    if (formInput.prompt) providerInput.prompt = formInput.prompt;
    if (formInput.aspectRatio) providerInput.aspectRatio = formInput.aspectRatio;
    if (formInput.resolution) providerInput.resolution = formInput.resolution;
    if (formInput.seed) providerInput.seed = formInput.seed;
    if (formInput.numberOfGenerations) providerInput.num = formInput.numberOfGenerations;
    if (formInput.negativePrompt) providerInput.negativePrompt = formInput.negativePrompt;
    if (formInput.duration) providerInput.duration = formInput.duration;
    if (formInput.mode) providerInput.mode = formInput.mode;
    
    // Model-specific fields
    if (formInput.numInferenceSteps) providerInput.numInferenceSteps = formInput.numInferenceSteps;
    if (formInput.guidanceScale) providerInput.guidanceScale = formInput.guidanceScale;
    if (formInput.enableSafetyChecker !== undefined) providerInput.enableSafetyChecker = formInput.enableSafetyChecker;
    if (formInput.outputFormat) providerInput.outputFormat = formInput.outputFormat;
    if (formInput.acceleration) providerInput.acceleration = formInput.acceleration;

    // Handle image uploads
    if (formInput.uploadedImages) {
      providerInput.imageUrl = formInput.uploadedImages[0]; // First image
    }

    // Handle scenes for storyboard
    if (formInput.scenes) {
      providerInput.scenes = formInput.scenes;
    }

    return providerInput;
  }

  mapOutputFromProvider(output: any): StandardizedOutput {
    return {
      taskId: output.taskId,
      status: this.mapProviderStatus(output.status),
      results: output.outputUrl
        ? [
            {
              fileUrl: output.outputUrl,
              fileType: this.inferFileType(output.outputUrl),
              thumbnailUrl: output.thumbnailUrl,
              metadata: output.metadata,
            },
          ]
        : [],
      error: output.error || output.errorMessage,
      createdAt: new Date(output.createdAt || Date.now()),
      updatedAt: new Date(output.updatedAt || Date.now()),
      completedAt: output.completedAt ? new Date(output.completedAt) : undefined,
    };
  }

  private mapProviderStatus(status: string): 'pending' | 'processing' | 'completed' | 'failed' {
    const statusMap: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
      pending: 'pending',
      queued: 'pending',
      processing: 'processing',
      running: 'processing',
      completed: 'completed',
      success: 'completed',
      failed: 'failed',
      error: 'failed',
    };

    return statusMap[status?.toLowerCase()] || 'pending';
  }

  private inferFileType(url: string): string {
    const ext = url.split('.').pop()?.toLowerCase();
    if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext && ['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
    if (ext && ['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    return 'unknown';
  }
}
