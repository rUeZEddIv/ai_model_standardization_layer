import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class TextToVideoDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsString()
  aiModelId: string;

  @ApiProperty({ description: 'Text prompt for video generation' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({ description: 'Duration of the video in seconds' })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ description: 'Aspect ratio of the output video (e.g., 16:9, 9:16)' })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional({ description: 'Resolution of the output video (e.g., 1080p, 720p)' })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional({ description: 'Seed for reproducible generation' })
  @IsOptional()
  @IsNumber()
  seed?: number;

  @ApiPropertyOptional({ description: 'Number of videos to generate' })
  @IsOptional()
  @IsNumber()
  numberOfGenerations?: number;

  @ApiPropertyOptional({ description: 'Make generation public', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
