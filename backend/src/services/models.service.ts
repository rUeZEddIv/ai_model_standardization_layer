import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiModel } from '../entities';
import { GenerationCategory } from '../enums';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(AiModel)
    private readonly aiModelRepository: Repository<AiModel>,
  ) {}

  async findByCategory(category: GenerationCategory): Promise<AiModel[]> {
    return this.aiModelRepository.find({
      where: {
        generationCategory: category,
        isActive: true,
      },
      relations: ['provider'],
    });
  }

  async findById(id: string): Promise<AiModel> {
    const model = await this.aiModelRepository.findOne({
      where: { id, isActive: true },
      relations: ['provider'],
    });

    if (!model) {
      throw new NotFoundException(`AI Model with ID ${id} not found`);
    }

    return model;
  }

  async getCapabilities(id: string): Promise<any> {
    const model = await this.findById(id);
    return model.capabilities;
  }
}
