import { PrismaService } from '../../prisma/prisma.service';
import { AdapterFactory } from '../../adapters/adapter.factory';
export declare class WebhookService {
    private prisma;
    private adapterFactory;
    private readonly logger;
    constructor(prisma: PrismaService, adapterFactory: AdapterFactory);
    handleCallback(payload: any, providerSlug?: string): Promise<{
        message: string;
    }>;
    private detectProvider;
}
