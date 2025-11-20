import { ConfigService } from '@nestjs/config';
import { BaseAIAdapter, GenerateResponse, WebhookResponse } from './base-ai.adapter';
export declare class KieAdapter implements BaseAIAdapter {
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(configService: ConfigService);
    getProviderName(): string;
    generate(payload: any): Promise<GenerateResponse>;
    handleWebhook(payload: any): Promise<WebhookResponse>;
    private mapToKieFormat;
    private getEndpoint;
    private mapKieStatus;
}
