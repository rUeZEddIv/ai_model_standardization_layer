import { BaseAIAdapter } from './base-ai.adapter';
import { KieAdapter } from './kie.adapter';
import { GeminiGenAdapter } from './geminigen.adapter';
export declare class AdapterFactory {
    private readonly kieAdapter;
    private readonly geminiGenAdapter;
    constructor(kieAdapter: KieAdapter, geminiGenAdapter: GeminiGenAdapter);
    getAdapter(providerSlug: string): BaseAIAdapter;
}
