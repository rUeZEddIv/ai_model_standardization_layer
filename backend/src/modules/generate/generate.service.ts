import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdapterFactory } from '../../adapters/adapter.factory';
import {
  GenerateRequestDto,
  GenerateResponseDto,
} from './dto/generate-request.dto';

@Injectable()
export class GenerateService {
  constructor(
    private prisma: PrismaService,
    private adapterFactory: AdapterFactory,
  ) {}

  async generate(
    dto: GenerateRequestDto,
    userId?: string,
  ): Promise<GenerateResponseDto> {
    // 1. Validate model exists and belongs to category
    const model = await this.prisma.aIModel.findUnique({
      where: { id: dto.aiModelId },
      include: {
        provider: true,
        category: true,
      },
    });

    if (!model) {
      throw new NotFoundException(`Model '${dto.aiModelId}' not found`);
    }

    if (model.category.slug !== dto.categoryId) {
      throw new BadRequestException(
        `Model '${dto.aiModelId}' does not belong to category '${dto.categoryId}'`,
      );
    }

    // 2. Validate input data against model capabilities
    this.validateInputData(
      dto.data,
      model.capabilities as any,
      model.category.slug,
    );

    // 3. Create transaction record
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        modelId: model.id,
        status: 'PENDING',
        inputPayload: dto.data as any,
      },
    });

    try {
      // 4. Get appropriate adapter for the provider
      const adapter = this.adapterFactory.getAdapter(model.provider.slug);

      // 5. Call provider API
      const result = await adapter.generate({
        category: model.category.slug,
        data: dto.data,
        model: {
          externalModelId: model.externalModelId,
          name: model.name,
        },
      });

      // 6. Update transaction with provider response
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: result.status,
          providerResponse: result.rawResponse,
        },
      });

      return {
        transactionId: transaction.id,
        taskId: result.taskId,
        status: result.status,
        message: 'Generation request submitted successfully',
      };
    } catch (error) {
      // Update transaction with error
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      throw error;
    }
  }

  private validateInputData(
    data: any,
    capabilities: any,
    categorySlug: string,
  ): void {
    // Validate aspect ratio if provided
    if (data.aspectRatio && capabilities.ratios) {
      if (!capabilities.ratios.includes(data.aspectRatio)) {
        throw new BadRequestException(
          `Invalid aspect ratio '${data.aspectRatio}'. Supported ratios: ${capabilities.ratios.join(', ')}`,
        );
      }
    }

    // Validate resolution if provided
    if (data.resolution && capabilities.resolutions) {
      if (!capabilities.resolutions.includes(data.resolution)) {
        throw new BadRequestException(
          `Invalid resolution '${data.resolution}'. Supported resolutions: ${capabilities.resolutions.join(', ')}`,
        );
      }
    }

    // Validate duration if provided
    if (data.duration && capabilities.durations) {
      if (!capabilities.durations.includes(data.duration)) {
        throw new BadRequestException(
          `Invalid duration '${data.duration}'. Supported durations: ${capabilities.durations.join(', ')} seconds`,
        );
      }
    }

    // Category-specific validation
    switch (categorySlug) {
      case 'text-to-image':
      case 'image-to-image':
        if (!data.prompt) {
          throw new BadRequestException('Prompt is required');
        }
        break;
      case 'text-to-video':
      case 'image-to-video':
        if (!data.prompt && categorySlug === 'text-to-video') {
          throw new BadRequestException('Prompt is required for text-to-video');
        }
        break;
      case 'speech-to-text':
        if (!data.uploadedAudio) {
          throw new BadRequestException('Audio file is required');
        }
        break;
      case 'text-to-speech':
        if (!data.text) {
          throw new BadRequestException('Text is required');
        }
        if (!data.voiceId) {
          throw new BadRequestException('Voice ID is required');
        }
        break;
    }
  }
}
