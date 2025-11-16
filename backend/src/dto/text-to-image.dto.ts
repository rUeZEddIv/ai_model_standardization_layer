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

export class TextToImageDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsUUID()
  aiModelId: string;

  @ApiProperty({ description: 'Text prompt for image generation' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({ description: 'Aspect ratio for the generated image' })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional({ description: 'Resolution for the generated image' })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional({ description: 'Random seed for reproducibility' })
  @IsOptional()
  @IsInt()
  seed?: number;

  @ApiPropertyOptional({
    description: 'Number of images to generate',
    minimum: 1,
    maximum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  numberOfGenerations?: number;

  @ApiPropertyOptional({
    description: 'Whether the generated content should be public',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
