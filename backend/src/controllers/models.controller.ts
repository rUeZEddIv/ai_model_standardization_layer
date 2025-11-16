import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ModelsService } from '../services';
import { GenerationCategory } from '../enums';

@ApiTags('models')
@Controller('api/v1/models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get AI models by generation category' })
  @ApiQuery({ name: 'category', enum: GenerationCategory })
  @ApiResponse({
    status: 200,
    description: 'List of AI models for the specified category',
  })
  async getModelsByCategory(@Query('category') category: GenerationCategory) {
    const models = await this.modelsService.findByCategory(category);

    return models.map((model) => ({
      id: model.id,
      name: model.name,
      provider: model.provider.name,
      modelIdentifier: model.modelIdentifier,
      generationCategory: model.generationCategory,
    }));
  }

  @Get(':id/capabilities')
  @ApiOperation({ summary: 'Get capabilities for a specific AI model' })
  @ApiResponse({
    status: 200,
    description:
      'Model capabilities (aspect ratios, resolutions, voices, etc.)',
  })
  @ApiResponse({ status: 404, description: 'Model not found' })
  async getModelCapabilities(@Param('id') id: string) {
    return this.modelsService.getCapabilities(id);
  }
}
