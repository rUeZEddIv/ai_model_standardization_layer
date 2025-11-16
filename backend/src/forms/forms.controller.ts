import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all form categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async getCategories() {
    const data = await this.formsService.getCategories();
    return ApiResponseDto.success(data);
  }

  @Get('models')
  @ApiOperation({ summary: 'Get all AI models' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiResponse({
    status: 200,
    description: 'Models retrieved successfully',
  })
  async getModels(@Query('categoryId') categoryId?: string) {
    const data = await this.formsService.getModels(categoryId);
    return ApiResponseDto.success(data);
  }

  @Get(':categoryId/schema')
  @ApiOperation({ summary: 'Get form schema for category' })
  @ApiQuery({ name: 'modelId', required: false })
  @ApiResponse({
    status: 200,
    description: 'Form schema retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Category or Model not found',
  })
  async getFormSchema(
    @Param('categoryId') categoryId: string,
    @Query('modelId') modelId?: string,
  ) {
    const data = await this.formsService.getFormSchema(categoryId, modelId);
    return ApiResponseDto.success(data);
  }
}
