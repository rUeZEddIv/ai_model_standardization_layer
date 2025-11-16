import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TextToVideoDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsUUID()
  aiModelId: string;

  @ApiProperty({ description: 'Text prompt for video generation' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({ description: 'Duration of the video in seconds' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(300)
  duration?: number;

  @ApiPropertyOptional({ description: 'Aspect ratio for the generated video' })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional({ description: 'Resolution for the generated video' })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional({ description: 'Random seed for reproducibility' })
  @IsOptional()
  @IsInt()
  seed?: number;

  @ApiPropertyOptional({
    description: 'Number of videos to generate',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  numberOfGenerations?: number;

  @ApiPropertyOptional({
    description: 'Whether the generated content should be public',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
