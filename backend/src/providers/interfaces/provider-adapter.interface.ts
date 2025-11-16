export interface StandardizedInput {
  category: string;
  aiModelId: string;
  input: Record<string, any>;
  webhookUrl?: string;
}

export interface StandardizedOutput {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: Array<{
    fileUrl: string;
    fileType: string;
    thumbnailUrl?: string;
    metadata?: any;
  }>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface ProviderResponse {
  taskId: string;
  status: string;
  raw?: any;
}

export interface TaskStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  results?: any[];
  error?: string;
}

export interface WebhookData {
  taskId: string;
  status: string;
  results?: any[];
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface AIProviderAdapter {
  createTask(input: StandardizedInput): Promise<ProviderResponse>;
  getTaskStatus(taskId: string): Promise<TaskStatus>;
  handleWebhook(payload: any): WebhookData;
  validateInput(input: any): ValidationResult;
  mapInputToProvider(input: StandardizedInput): any;
  mapOutputFromProvider(output: any): StandardizedOutput;
}
