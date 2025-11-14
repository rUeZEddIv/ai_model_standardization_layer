import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SpeakerDto {
  @ApiProperty({ description: 'Text for this speaker' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Voice ID for this speaker' })
  @IsString()
  voiceId: string;
}

export class TextToSpeechDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsString()
  aiModelId: string;

  @ApiPropertyOptional({ description: 'Speech style' })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiProperty({ description: 'Text to convert to speech' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'Voice ID to use' })
  @IsOptional()
  @IsString()
  voiceId?: string;

  @ApiPropertyOptional({ description: 'Language of the speech' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Make generation public', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class TextToSpeechMultiDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsString()
  aiModelId: string;

  @ApiPropertyOptional({ description: 'Speech style' })
  @IsOptional()
  @IsString()
  style?: string;

  @ApiPropertyOptional({ description: 'Language of the speech' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Make generation public', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ 
    description: 'Array of speakers (max 10)', 
    type: [SpeakerDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpeakerDto)
  speakers: SpeakerDto[];
}
