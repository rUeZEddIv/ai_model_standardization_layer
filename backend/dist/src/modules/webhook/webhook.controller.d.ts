import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private readonly webhookService;
    constructor(webhookService: WebhookService);
    handleCallback(payload: any, providerHeader?: string): Promise<{
        message: string;
    }>;
}
