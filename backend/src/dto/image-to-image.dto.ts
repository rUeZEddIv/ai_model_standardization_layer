import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUUID,
  IsArray,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UploadedImageInfo {
  @ApiProperty({ description: 'Original filename' })
  @IsString()
  filename: string;

  @ApiProperty({ description: 'MIME type of the uploaded image' })
  @IsString()
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  @IsInt()
  size: number;

  @ApiProperty({ description: 'URL or path to the uploaded image' })
  @IsString()
  url: string;
}

export class ImageToImageDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsUUID()
  aiModelId: string;

  @ApiProperty({
    description: 'Array of uploaded image URLs or paths',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  uploadedImages: string[];

  @ApiProperty({
    description: 'Information about uploaded images',
    type: [UploadedImageInfo],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UploadedImageInfo)
  uploadedImageInfo: UploadedImageInfo[];

  @ApiProperty({ description: 'Text prompt for image transformation' })
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
