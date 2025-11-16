import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerationsService } from './generations.service';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('generations')
@Controller('generations')
export class GenerationsController {
  constructor(private readonly generationsService: GenerationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new generation task' })
  @ApiResponse({
    status: 201,
    description: 'Generation task created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Category or Model not found',
  })
  async create(@Body() createGenerationDto: CreateGenerationDto) {
    const data = await this.generationsService.createGeneration(createGenerationDto);
    return ApiResponseDto.success(data);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Get generation task status' })
  @ApiResponse({
    status: 200,
    description: 'Task status retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Task not found',
  })
  async getStatus(@Param('taskId') taskId: string) {
    const data = await this.generationsService.getTaskStatus(taskId);
    return ApiResponseDto.success(data);
  }
}
