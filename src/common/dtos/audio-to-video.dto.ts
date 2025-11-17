import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TextToVideoDto } from './text-to-video.dto';

export class AudioToVideoDto extends TextToVideoDto {
  @ApiPropertyOptional({
    description: 'Uploaded image (optional)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  uploadedImage?: string;

  @ApiProperty({
    description: 'Uploaded audio (required)',
    type: 'string',
    format: 'binary',
  })
  @IsString()
  uploadedAudio: string;
}
