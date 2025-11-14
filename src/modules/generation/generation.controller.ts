import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JobsService } from '../jobs/jobs.service';
import { TextToImageDto } from '../../common/dtos/text-to-image.dto';
import { ImageToImageDto } from '../../common/dtos/image-to-image.dto';
import { TextToVideoDto } from '../../common/dtos/text-to-video.dto';
import { ImageToVideoDto } from '../../common/dtos/image-to-video.dto';
import { AudioToVideoDto } from '../../common/dtos/audio-to-video.dto';
import { StoryboardToVideoDto } from '../../common/dtos/storyboard-to-video.dto';
import { TextToMusicDto } from '../../common/dtos/text-to-music.dto';
import { SpeechToTextDto } from '../../common/dtos/speech-to-text.dto';
import { TextToSpeechDto, TextToSpeechMultiDto } from '../../common/dtos/text-to-speech.dto';
import { StandardizedResponseDto } from '../../common/dtos/standardized-response.dto';

@ApiTags('Generation')
@Controller('api/v1/generation')
export class GenerationController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('text-to-image')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Generate image from text' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async textToImage(@Body() dto: TextToImageDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'TEXT_TO_IMAGE',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('image-to-image')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Generate image from image and text' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async imageToImage(@Body() dto: ImageToImageDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'IMAGE_TO_IMAGE',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('text-to-video')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Generate video from text' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async textToVideo(@Body() dto: TextToVideoDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'TEXT_TO_VIDEO',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('image-to-video')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Generate video from image and text' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async imageToVideo(@Body() dto: ImageToVideoDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'IMAGE_TO_VIDEO',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('audio-to-video')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Generate video from audio' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async audioToVideo(@Body() dto: AudioToVideoDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'AUDIO_TO_VIDEO',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('storyboard-to-video')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Generate video from storyboard' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async storyboardToVideo(@Body() dto: StoryboardToVideoDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'STORYBOARD_TO_VIDEO',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('text-to-music')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Generate music from text' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async textToMusic(@Body() dto: TextToMusicDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'TEXT_TO_MUSIC',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('speech-to-text')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Convert speech to text' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async speechToText(@Body() dto: SpeechToTextDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'SPEECH_TO_TEXT',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('text-to-speech')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Convert text to speech (single speaker)' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async textToSpeech(@Body() dto: TextToSpeechDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'TEXT_TO_SPEECH_SINGLE',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Post('text-to-speech-multi')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Convert text to speech (multiple speakers)' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Job created successfully',
    type: StandardizedResponseDto,
  })
  async textToSpeechMulti(@Body() dto: TextToSpeechMultiDto) {
    const job = await this.jobsService.createJob(
      dto.aiModelId,
      'TEXT_TO_SPEECH_MULTI',
      dto,
    );
    return this.mapJobToResponse(job);
  }

  @Get('job/:id')
  @ApiOperation({ summary: 'Get job status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Job details',
    type: StandardizedResponseDto,
  })
  async getJob(@Param('id') id: string) {
    const job = await this.jobsService.getJob(id);
    return this.mapJobToResponse(job);
  }

  private mapJobToResponse(job: any): StandardizedResponseDto {
    return {
      id: job.id,
      status: job.status,
      statusPercentage: this.getStatusPercentage(job.status),
      resultUrl: job.resultUrl,
      thumbnailUrl: job.thumbnailUrl,
      errorMessage: job.errorMessage,
      errorCode: job.errorCode,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      category: job.category,
      modelName: job.model?.name || 'Unknown',
      providerName: job.provider?.name || 'Unknown',
    };
  }

  private getStatusPercentage(status: string): number {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PROCESSING':
        return 50;
      case 'COMPLETED':
        return 100;
      case 'FAILED':
      case 'CANCELLED':
        return 0;
      default:
        return 0;
    }
  }
}
