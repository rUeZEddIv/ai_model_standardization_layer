import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerateService } from './generate.service';
import {
  GenerateRequestDto,
  GenerateResponseDto,
} from './dto/generate-request.dto';

@ApiTags('Generate')
@Controller('api/v1')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate AI content',
    description: 'Unified endpoint for all AI content generation categories',
  })
  @ApiResponse({
    status: 201,
    description: 'Generation request submitted successfully',
    type: GenerateResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Model or category not found',
  })
  async generate(
    @Body() dto: GenerateRequestDto,
  ): Promise<GenerateResponseDto> {
    return this.generateService.generate(dto);
  }
}
