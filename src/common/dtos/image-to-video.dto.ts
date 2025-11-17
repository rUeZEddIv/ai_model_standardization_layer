import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { TextToVideoDto } from './text-to-video.dto';

export class ImageToVideoDto extends TextToVideoDto {
  @ApiProperty({
    description: 'Uploaded images (max 10)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsArray()
  @IsOptional()
  uploadedImages?: string[];
}
