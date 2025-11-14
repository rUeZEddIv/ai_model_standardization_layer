import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ProviderAdapter } from '../../common/interfaces/provider-adapter.interface';
import { KieAiAdapter } from './kie-ai.adapter';
import { GeminiGenAdapter } from './geminigen.adapter';

@Injectable()
export class AdapterFactory {
  private adapters: Map<string, ProviderAdapter>;

  constructor(private readonly httpService: HttpService) {
    this.adapters = new Map();
    this.registerAdapters();
  }

  private registerAdapters(): void {
    this.adapters.set('kie.ai', new KieAiAdapter(this.httpService));
    this.adapters.set('geminigen.ai', new GeminiGenAdapter(this.httpService));
  }

  getAdapter(providerSlug: string): ProviderAdapter {
    const adapter = this.adapters.get(providerSlug);
    if (!adapter) {
      throw new Error(`No adapter found for provider: ${providerSlug}`);
    }
    return adapter;
  }

  getAllAdapters(): ProviderAdapter[] {
    return Array.from(this.adapters.values());
  }
}
