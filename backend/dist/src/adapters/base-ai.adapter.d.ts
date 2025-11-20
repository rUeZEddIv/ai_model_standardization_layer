export interface BaseAIAdapter {
    generate(payload: any): Promise<GenerateResponse>;
    handleWebhook(payload: any): Promise<WebhookResponse>;
    getProviderName(): string;
}
export interface GenerateResponse {
    taskId: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    rawResponse?: any;
}
export interface WebhookResponse {
    taskId: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    outputResult?: {
        urls?: string[];
        data?: any;
    };
    errorMessage?: string;
}
