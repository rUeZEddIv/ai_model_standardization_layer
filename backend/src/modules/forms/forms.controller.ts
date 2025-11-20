import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FormSchemaService } from './form-schema.service';
import { FormSchema } from './interfaces/form-schema.interface';

@ApiTags('Forms')
@Controller('api/v1/forms')
export class FormsController {
  constructor(private readonly formSchemaService: FormSchemaService) {}

  @Get(':categorySlug/schema')
  @ApiOperation({
    summary: 'Get dynamic form schema for a category',
    description:
      'Returns form schema based on category and optional AI model. If no model is specified, returns available models.',
  })
  @ApiParam({
    name: 'categorySlug',
    description: 'Category slug (e.g., text-to-image, image-to-image)',
    example: 'text-to-image',
  })
  @ApiQuery({
    name: 'aiModelId',
    description: 'Optional AI Model ID to get specific form schema',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Form schema retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Category or model not found',
  })
  async getFormSchema(
    @Param('categorySlug') categorySlug: string,
    @Query('aiModelId') aiModelId?: string,
  ): Promise<FormSchema> {
    return this.formSchemaService.getFormSchema(categorySlug, aiModelId);
  }
}
