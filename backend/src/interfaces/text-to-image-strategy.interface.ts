import { TextToImageDto } from '../dto';

export interface GenerationResult {
  jobId?: string;
  status: 'PENDING' | 'COMPLETED';
  outputs?: Array<{
    type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT';
    url?: string;
    textContent?: string;
  }>;
  providerJobId?: string;
  message?: string;
}

export interface ITextToImageStrategy {
  generate(dto: TextToImageDto, apiKey: string): Promise<GenerationResult>;
  handleWebhook?(payload: any): Promise<GenerationResult>;
}
