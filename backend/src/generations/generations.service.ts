import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KieAdapter } from '../providers/adapters/kie.adapter';
import { GeminiGenAdapter } from '../providers/adapters/geminigen.adapter';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { AIProviderAdapter } from '../providers/interfaces/provider-adapter.interface';

@Injectable()
export class GenerationsService {
  private readonly logger = new Logger(GenerationsService.name);

  constructor(
    private prisma: PrismaService,
    private kieAdapter: KieAdapter,
    private geminiGenAdapter: GeminiGenAdapter,
  ) {}

  async createGeneration(createGenerationDto: CreateGenerationDto) {
    const { category, aiModelId, input, webhookUrl } = createGenerationDto;

    // Find the category
    const formCategory = await this.prisma.formCategory.findFirst({
      where: { slug: category },
    });

    if (!formCategory) {
      throw new NotFoundException(`Category '${category}' not found`);
    }

    // Find the model
    const aiModel = await this.prisma.aiModel.findUnique({
      where: { id: aiModelId },
      include: {
        provider: true,
        fieldMappings: true,
      },
    });

    if (!aiModel) {
      throw new NotFoundException(`AI Model '${aiModelId}' not found`);
    }

    if (!aiModel.isActive) {
      throw new BadRequestException(`AI Model '${aiModel.displayName}' is not active`);
    }

    // Get the appropriate adapter
    const adapter = this.getAdapterForProvider(aiModel.provider.name);

    // Validate input
    const validation = adapter.validateInput(input);
    if (!validation.valid) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Create generation task in database
    const task = await this.prisma.generationTask.create({
      data: {
        categoryId: formCategory.id,
        modelId: aiModel.id,
        providerId: aiModel.providerId,
        status: 'pending',
        inputData: input,
        webhookUrl,
      },
    });

    try {
      // Call provider API
      const providerResponse = await adapter.createTask({
        category,
        aiModelId: aiModel.modelIdentifier,
        input,
        webhookUrl,
      });

      // Update task with provider's task ID
      await this.prisma.generationTask.update({
        where: { id: task.id },
        data: {
          taskId: providerResponse.taskId,
          status: 'processing',
        },
      });

      return {
        taskId: task.id,
        status: 'pending',
        estimatedCompletionTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes estimate
        pollingUrl: `/api/v1/generations/${task.id}`,
        createdAt: task.createdAt,
      };
    } catch (error) {
      this.logger.error(`Failed to create task with provider: ${error.message}`);
      
      // Update task as failed
      await this.prisma.generationTask.update({
        where: { id: task.id },
        data: {
          status: 'failed',
          errorMessage: error.message,
        },
      });

      throw error;
    }
  }

  async getTaskStatus(taskId: string) {
    const task = await this.prisma.generationTask.findUnique({
      where: { id: taskId },
      include: {
        results: true,
        model: {
          include: {
            provider: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task '${taskId}' not found`);
    }

    // If task is completed or failed, return stored results
    if (task.status === 'completed' || task.status === 'failed') {
      return this.formatTaskResponse(task);
    }

    // Otherwise, poll the provider
    if (task.taskId) {
      try {
        const adapter = this.getAdapterForProvider(task.model.provider.name);
        const providerStatus = await adapter.getTaskStatus(task.taskId);

        // Update task status
        await this.prisma.generationTask.update({
          where: { id: taskId },
          data: {
            status: providerStatus.status,
            outputData: providerStatus.results as any || task.outputData,
            errorMessage: providerStatus.error || task.errorMessage,
            completedAt: providerStatus.status === 'completed' ? new Date() : task.completedAt,
          },
        });

        // Store results if completed
        if (providerStatus.status === 'completed' && providerStatus.results) {
          for (const result of providerStatus.results) {
            await this.prisma.generationResult.create({
              data: {
                taskId: task.id,
                fileUrl: result.url || result.fileUrl,
                fileType: this.inferFileType(result.url || result.fileUrl),
                metadata: result as any,
                isPublic: (task.inputData as any)?.isPublic || false,
              },
            });
          }
        }

        // Fetch updated task
        const updatedTask = await this.prisma.generationTask.findUnique({
          where: { id: taskId },
          include: { results: true },
        });

        return this.formatTaskResponse(updatedTask);
      } catch (error) {
        this.logger.error(`Failed to get task status from provider: ${error.message}`);
        // Return current task state
        return this.formatTaskResponse(task);
      }
    }

    return this.formatTaskResponse(task);
  }

  private formatTaskResponse(task: any) {
    return {
      taskId: task.id,
      status: task.status,
      progress: task.status === 'completed' ? 100 : task.status === 'processing' ? 50 : 0,
      results: task.results?.map((r) => ({
        fileUrl: r.fileUrl,
        fileType: r.fileType,
        thumbnailUrl: r.thumbnailUrl,
        metadata: r.metadata,
      })),
      error: task.errorMessage,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt,
    };
  }

  private getAdapterForProvider(providerName: string): AIProviderAdapter {
    if (providerName.toLowerCase().includes('kie')) {
      return this.kieAdapter;
    } else if (providerName.toLowerCase().includes('gemini')) {
      return this.geminiGenAdapter;
    }
    throw new BadRequestException(`Unsupported provider: ${providerName}`);
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
