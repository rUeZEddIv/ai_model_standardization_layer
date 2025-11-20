import { Injectable } from '@nestjs/common';
import { BaseAIAdapter } from './base-ai.adapter';
import { KieAdapter } from './kie.adapter';
import { GeminiGenAdapter } from './geminigen.adapter';

@Injectable()
export class AdapterFactory {
  constructor(
    private readonly kieAdapter: KieAdapter,
    private readonly geminiGenAdapter: GeminiGenAdapter,
  ) {}

  getAdapter(providerSlug: string): BaseAIAdapter {
    switch (providerSlug.toLowerCase()) {
      case 'kie':
      case 'kie.ai':
        return this.kieAdapter;
      case 'geminigen':
      case 'geminigen.ai':
        return this.geminiGenAdapter;
      default:
        throw new Error(`Unsupported provider: ${providerSlug}`);
    }
  }
}
