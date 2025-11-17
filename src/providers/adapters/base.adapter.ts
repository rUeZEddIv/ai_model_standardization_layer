import { HttpService } from '@nestjs/axios';
import { ProviderAdapter } from '../../common/interfaces/provider-adapter.interface';

export abstract class BaseAdapter implements ProviderAdapter {
  constructor(protected readonly httpService: HttpService) {}

  abstract getProviderName(): string;
  abstract mapRequest(category: string, standardizedRequest: any): any;
  abstract mapResponse(category: string, providerResponse: any): any;
  abstract mapWebhook(webhookPayload: any): any;
  abstract submitGeneration(
    category: string,
    mappedRequest: any,
    apiKey: string,
  ): Promise<any>;
  abstract getStatus(taskId: string, apiKey: string): Promise<any>;
  abstract getSupportedModels(): Promise<any[]>;

  protected getHeaders(apiKey: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }

  protected handleError(error: any): never {
    const message = error.response?.data?.message || error.message;
    throw new Error(`Provider error: ${message}`);
  }
}
