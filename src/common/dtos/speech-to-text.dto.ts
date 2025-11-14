import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class SpeechToTextDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsString()
  aiModelId: string;

  @ApiProperty({
    description: 'Uploaded audio file',
    type: 'string',
    format: 'binary',
  })
  @IsString()
  uploadedAudio: string;

  @ApiPropertyOptional({ description: 'Language of the audio' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Make generation public',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
