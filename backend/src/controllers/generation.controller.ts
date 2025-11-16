import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { TextToImageDto } from '../dto';
import { TextToImageService } from '../services';

@ApiTags('generation')
@Controller('api/v1/generate')
export class GenerationController {
  constructor(private readonly textToImageService: TextToImageService) {}

  @Post('text-to-image')
  @ApiOperation({ summary: 'Generate image from text prompt' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'User ID for authentication',
    required: true,
  })
  @ApiBody({ type: TextToImageDto })
  @ApiResponse({ status: 201, description: 'Image generation job created' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or missing API credentials',
  })
  async generateTextToImage(
    @Headers('x-user-id') userId: string,
    @Body() dto: TextToImageDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException(
        'User ID is required in x-user-id header',
      );
    }

    return this.textToImageService.generate(userId, dto);
  }

  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Get status of a generation job' })
  @ApiResponse({ status: 200, description: 'Job status and details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getJobStatus(@Param('jobId') jobId: string) {
    const job = await this.textToImageService.getJobStatus(jobId);

    return {
      jobId: job.id,
      status: job.status,
      providerJobId: job.providerJobId,
      inputPayload: job.inputPayload,
      outputPayload: job.outputPayload,
      errorMessage: job.errorMessage,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
