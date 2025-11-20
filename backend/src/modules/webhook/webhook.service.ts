import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdapterFactory } from '../../adapters/adapter.factory';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private prisma: PrismaService,
    private adapterFactory: AdapterFactory,
  ) {}

  async handleCallback(
    payload: any,
    providerSlug?: string,
  ): Promise<{ message: string }> {
    this.logger.log(`Received webhook callback: ${JSON.stringify(payload)}`);

    // Detect provider from payload or header
    const detectedProvider = providerSlug || this.detectProvider(payload);

    if (!detectedProvider) {
      this.logger.error('Could not detect provider from webhook payload');
      throw new Error('Could not detect provider');
    }

    try {
      // Get adapter for the provider
      const adapter = this.adapterFactory.getAdapter(detectedProvider);

      // Parse webhook using adapter
      const webhookResponse = await adapter.handleWebhook(payload);

      // Find transaction by task ID
      const transaction = await this.prisma.transaction.findFirst({
        where: {
          providerResponse: {
            path: ['data', 'taskId'],
            equals: webhookResponse.taskId,
          },
        },
      });

      if (!transaction) {
        // Try alternative search
        const allTransactions = await this.prisma.transaction.findMany({
          where: {
            status: {
              in: ['PENDING', 'PROCESSING'],
            },
          },
        });

        const foundTransaction = allTransactions.find((t) => {
          const response = t.providerResponse as any;
          return (
            response?.data?.taskId === webhookResponse.taskId ||
            response?.taskId === webhookResponse.taskId
          );
        });

        if (!foundTransaction) {
          this.logger.warn(
            `Transaction not found for taskId: ${webhookResponse.taskId}`,
          );
          throw new NotFoundException(
            `Transaction not found for taskId: ${webhookResponse.taskId}`,
          );
        }

        // Update the found transaction
        await this.prisma.transaction.update({
          where: { id: foundTransaction.id },
          data: {
            status: webhookResponse.status,
            outputResult: webhookResponse.outputResult as any,
            errorMessage: webhookResponse.errorMessage,
          },
        });

        this.logger.log(
          `Transaction ${foundTransaction.id} updated to status: ${webhookResponse.status}`,
        );

        return { message: 'Webhook processed successfully' };
      }

      // Update transaction
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: webhookResponse.status,
          outputResult: webhookResponse.outputResult as any,
          errorMessage: webhookResponse.errorMessage,
        },
      });

      this.logger.log(
        `Transaction ${transaction.id} updated to status: ${webhookResponse.status}`,
      );

      return { message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`);
      throw error;
    }
  }

  private detectProvider(payload: any): string | null {
    // KIE.AI detection - typically has 'code' field with value 200
    if (payload.code !== undefined && payload.data?.taskId) {
      return 'kie';
    }

    // GeminiGen.AI detection - typically has 'uuid' and 'status' fields
    if (payload.uuid && payload.status !== undefined) {
      return 'geminigen';
    }

    // Check for specific field patterns
    if (payload.taskId || payload.task_id) {
      // Could be either, try to determine by other fields
      if (payload.msg || payload.code) {
        return 'kie';
      }
      if (payload.generate_result || payload.used_credit !== undefined) {
        return 'geminigen';
      }
    }

    return null;
  }
}
