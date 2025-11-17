import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class TextToImageDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsString()
  aiModelId: string;

  @ApiProperty({ description: 'Text prompt for image generation' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({
    description: 'Aspect ratio of the output image (e.g., 16:9, 1:1)',
  })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional({
    description: 'Resolution of the output image (e.g., 1080p, 720p)',
  })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional({ description: 'Seed for reproducible generation' })
  @IsOptional()
  @IsNumber()
  seed?: number;

  @ApiPropertyOptional({ description: 'Number of images to generate' })
  @IsOptional()
  @IsNumber()
  numberOfGenerations?: number;

  @ApiPropertyOptional({
    description: 'Make generation public',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
