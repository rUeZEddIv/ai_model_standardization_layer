import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { GenerationCategory } from '@prisma/client';

@ApiTags('Models')
@Controller('api/v1/models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new AI model' })
  async createModel(
    @Body()
    data: {
      providerId: string;
      name: string;
      slug: string;
      category: GenerationCategory;
      capabilities?: any;
    },
  ) {
    return this.modelsService.createModel(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all AI models' })
  async listModels(
    @Query('providerId') providerId?: string,
    @Query('category') category?: GenerationCategory,
    @Query('isActive') isActive?: string,
  ) {
    return this.modelsService.listModels({
      providerId,
      category,
      isActive: isActive ? isActive === 'true' : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get model by ID' })
  async getModel(@Param('id') id: string) {
    return this.modelsService.getModel(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update model' })
  async updateModel(@Param('id') id: string, @Body() data: any) {
    return this.modelsService.updateModel(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete model' })
  async deleteModel(@Param('id') id: string) {
    return this.modelsService.deleteModel(id);
  }
}
