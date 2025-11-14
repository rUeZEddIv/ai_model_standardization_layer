import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { ApiKeyStatus } from '@prisma/client';

@Injectable()
export class ApiKeysService {
  private readonly logger = new Logger(ApiKeysService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getActiveKey(providerId: string): Promise<any> {
    // Get active keys sorted by priority and last used time
    const keys = await this.prisma.apiKey.findMany({
      where: {
        providerId,
        status: ApiKeyStatus.ACTIVE,
        OR: [
          { rateLimitResetAt: null },
          { rateLimitResetAt: { lte: new Date() } },
        ],
      },
      orderBy: [
        { priority: 'desc' },
        { lastUsedAt: 'asc' },
      ],
    });

    if (keys.length === 0) {
      throw new Error(`No active API keys available for provider ${providerId}`);
    }

    const selectedKey = keys[0];

    // Update last used time
    await this.prisma.apiKey.update({
      where: { id: selectedKey.id },
      data: { lastUsedAt: new Date() },
    });

    return selectedKey;
  }

  async markKeyAsError(apiKeyId: string, error?: string): Promise<void> {
    const key = await this.prisma.apiKey.findUnique({
      where: { id: apiKeyId },
    });

    if (!key) return;

    const newErrorCount = key.errorCount + 1;

    // If error count exceeds threshold, mark as inactive
    if (newErrorCount >= 3) {
      await this.prisma.apiKey.update({
        where: { id: apiKeyId },
        data: {
          status: ApiKeyStatus.ERROR,
          errorCount: newErrorCount,
        },
      });
      this.logger.warn(`API Key ${apiKeyId} marked as ERROR after ${newErrorCount} failures`);
    } else {
      await this.prisma.apiKey.update({
        where: { id: apiKeyId },
        data: { errorCount: newErrorCount },
      });
    }
  }

  async markKeyAsRateLimited(apiKeyId: string, resetAt?: Date): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        status: ApiKeyStatus.RATE_LIMITED,
        rateLimitResetAt: resetAt || new Date(Date.now() + 60 * 60 * 1000), // Default 1 hour
      },
    });
    this.logger.warn(`API Key ${apiKeyId} marked as RATE_LIMITED until ${resetAt}`);
  }

  async resetErrorCount(apiKeyId: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        errorCount: 0,
        status: ApiKeyStatus.ACTIVE,
      },
    });
  }

  async createApiKey(providerId: string, key: string, priority: number = 0): Promise<any> {
    return this.prisma.apiKey.create({
      data: {
        providerId,
        key,
        priority,
        status: ApiKeyStatus.ACTIVE,
      },
    });
  }

  async listApiKeys(providerId?: string): Promise<any[]> {
    return this.prisma.apiKey.findMany({
      where: providerId ? { providerId } : undefined,
      include: { provider: true },
      orderBy: [
        { providerId: 'asc' },
        { priority: 'desc' },
      ],
    });
  }

  async updateApiKeyStatus(apiKeyId: string, status: ApiKeyStatus): Promise<any> {
    return this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { status },
    });
  }

  async deleteApiKey(apiKeyId: string): Promise<void> {
    await this.prisma.apiKey.delete({
      where: { id: apiKeyId },
    });
  }
}
