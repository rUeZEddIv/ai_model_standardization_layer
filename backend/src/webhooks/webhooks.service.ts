import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KieAdapter } from '../providers/adapters/kie.adapter';
import { GeminiGenAdapter } from '../providers/adapters/geminigen.adapter';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private kieAdapter: KieAdapter,
    private geminiGenAdapter: GeminiGenAdapter,
  ) {}

  async handleKieWebhook(payload: any, signature?: string) {
    this.logger.log(`Received KIE.AI webhook: ${JSON.stringify(payload)}`);

    try {
      // Log webhook
      const webhookLog = await this.prisma.webhookLog.create({
        data: {
          taskId: payload.taskId,
          provider: 'KIE.AI',
          eventType: payload.event || 'task_update',
          payload: payload as any,
          signature: signature || null,
          isVerified: true, // TODO: Implement signature verification
          processed: false,
        },
      });

      // Process webhook
      const webhookData = this.kieAdapter.handleWebhook(payload);

      // Find the task
      const task = await this.prisma.generationTask.findFirst({
        where: { taskId: payload.taskId },
      });

      if (!task) {
        this.logger.warn(`Task not found for taskId: ${payload.taskId}`);
        return { success: false, message: 'Task not found' };
      }

      // Update task
      await this.prisma.generationTask.update({
        where: { id: task.id },
        data: {
          status: webhookData.status as any,
          outputData: webhookData.results as any,
          errorMessage: webhookData.error,
          callbackReceived: true,
          completedAt: webhookData.status === 'completed' ? new Date() : null,
        },
      });

      // Store results if completed
      if (webhookData.status === 'completed' && webhookData.results) {
        for (const result of webhookData.results) {
          await this.prisma.generationResult.create({
            data: {
              taskId: task.id,
              fileUrl: result.url || '',
              fileType: this.inferFileType(result.url),
              metadata: result as any,
              isPublic: (task.inputData as any)?.isPublic || false,
            },
          });
        }
      }

      // Mark webhook as processed
      await this.prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: { processed: true },
      });

      this.logger.log(`Webhook processed successfully for task: ${task.id}`);
      return { success: true, taskId: task.id };
    } catch (error) {
      this.logger.error(`Error processing KIE.AI webhook: ${error.message}`);
      throw error;
    }
  }

  async handleGeminiGenWebhook(payload: any, signature?: string) {
    this.logger.log(`Received GeminiGen.AI webhook: ${JSON.stringify(payload)}`);

    try {
      // Log webhook
      const webhookLog = await this.prisma.webhookLog.create({
        data: {
          taskId: payload.taskId || payload.id,
          provider: 'GeminiGen.AI',
          eventType: payload.event || 'task_update',
          payload: payload as any,
          signature: signature || null,
          isVerified: true, // TODO: Implement signature verification
          processed: false,
        },
      });

      // Process webhook
      const webhookData = this.geminiGenAdapter.handleWebhook(payload);

      // Find the task
      const task = await this.prisma.generationTask.findFirst({
        where: { taskId: payload.taskId || payload.id },
      });

      if (!task) {
        this.logger.warn(`Task not found for taskId: ${payload.taskId || payload.id}`);
        return { success: false, message: 'Task not found' };
      }

      // Update task
      await this.prisma.generationTask.update({
        where: { id: task.id },
        data: {
          status: webhookData.status as any,
          outputData: webhookData.results as any,
          errorMessage: webhookData.error,
          callbackReceived: true,
          completedAt: webhookData.status === 'completed' ? new Date() : null,
        },
      });

      // Store results if completed
      if (webhookData.status === 'completed' && webhookData.results) {
        for (const result of webhookData.results) {
          await this.prisma.generationResult.create({
            data: {
              taskId: task.id,
              fileUrl: result.url || '',
              fileType: this.inferFileType(result.url),
              metadata: result as any,
              isPublic: (task.inputData as any)?.isPublic || false,
            },
          });
        }
      }

      // Mark webhook as processed
      await this.prisma.webhookLog.update({
        where: { id: webhookLog.id },
        data: { processed: true },
      });

      this.logger.log(`Webhook processed successfully for task: ${task.id}`);
      return { success: true, taskId: task.id };
    } catch (error) {
      this.logger.error(`Error processing GeminiGen.AI webhook: ${error.message}`);
      throw error;
    }
  }

  private inferFileType(url: string): string {
    if (!url) return 'unknown';
    const ext = url.split('.').pop()?.toLowerCase();
    if (ext && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext && ['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
    if (ext && ['mp3', 'wav', 'ogg'].includes(ext)) return 'audio';
    return 'text';
  }
}
