import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { TextToImageDto } from './text-to-image.dto';

export class ImageToImageDto extends TextToImageDto {
  @ApiProperty({
    description: 'Uploaded images (max 10)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsArray()
  @IsOptional()
  uploadedImages?: string[];
}
