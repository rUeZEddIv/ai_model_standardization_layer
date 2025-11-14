import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class TextToMusicDto {
  @ApiProperty({ description: 'AI Model ID to use for generation' })
  @IsString()
  aiModelId: string;

  @ApiPropertyOptional({ description: 'Title of the music track' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Music style or genre' })
  @IsString()
  musicStyle: string;

  @ApiPropertyOptional({ description: 'Generate instrumental only', default: false })
  @IsOptional()
  @IsBoolean()
  isInstrumental?: boolean;

  @ApiPropertyOptional({ description: 'Lyrics (required if non-instrumental)' })
  @IsOptional()
  @IsString()
  lyrics?: string;

  @ApiPropertyOptional({ description: 'Vocal gender preference' })
  @IsOptional()
  @IsString()
  vocalGender?: string;

  @ApiPropertyOptional({ description: 'Make generation public', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
