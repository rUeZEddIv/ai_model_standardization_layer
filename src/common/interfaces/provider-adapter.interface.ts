export interface ProviderAdapter {
  /**
   * Get provider name
   */
  getProviderName(): string;

  /**
   * Map standardized request to provider-specific format
   */
  mapRequest(category: string, standardizedRequest: any): any;

  /**
   * Map provider response to standardized format
   */
  mapResponse(category: string, providerResponse: any): any;

  /**
   * Map provider webhook payload to standardized format
   */
  mapWebhook(webhookPayload: any): any;

  /**
   * Submit generation request to provider
   */
  submitGeneration(
    category: string,
    mappedRequest: any,
    apiKey: string,
  ): Promise<any>;

  /**
   * Get generation status from provider
   */
  getStatus(taskId: string, apiKey: string): Promise<any>;

  /**
   * Get supported models for this provider
   */
  getSupportedModels(): Promise<any[]>;
}
