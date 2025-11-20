export interface BaseAIAdapter {
  /**
   * Generate content using the AI provider
   * @param payload - Standardized payload for generation
   * @returns Provider-specific response with task ID
   */
  generate(payload: any): Promise<GenerateResponse>;

  /**
   * Handle webhook callback from the AI provider
   * @param payload - Raw webhook payload from provider
   * @returns Standardized callback data
   */
  handleWebhook(payload: any): Promise<WebhookResponse>;

  /**
   * Get provider name
   */
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
