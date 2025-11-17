import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SceneDto {
  @ApiPropertyOptional({
    description: 'Scene image (optional)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  sceneImage?: string;

  @ApiProperty({ description: 'Text prompt for the scene' })
  @IsString()
  prompt: string;

  @ApiProperty({ description: 'Duration of the scene in seconds' })
  @IsNumber()
  duration: number;
}

export class StoryboardToVideoDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsString()
  aiModelId: string;

  @ApiPropertyOptional({
    description: 'Aspect ratio of the output video (e.g., 16:9, 9:16)',
  })
  @IsOptional()
  @IsString()
  aspectRatio?: string;

  @ApiPropertyOptional({
    description: 'Resolution of the output video (e.g., 1080p, 720p)',
  })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional({
    description: 'Make generation public',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    description: 'Array of scenes (max 10)',
    type: [SceneDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SceneDto)
  scenes: SceneDto[];
}
