import { IsString, IsNotEmpty, IsOptional, IsObject, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenerationDto {
  @ApiProperty({
    description: 'Form category slug (e.g., text-to-image)',
    example: 'text-to-image',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'AI Model UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  aiModelId: string;

  @ApiProperty({
    description: 'Dynamic input fields based on model',
    example: {
      prompt: 'A beautiful sunset over mountains',
      aspectRatio: '16:9',
      numberOfGenerations: 1,
    },
  })
  @IsObject()
  @IsNotEmpty()
  input: Record<string, any>;

  @ApiProperty({
    description: 'Optional webhook URL for callbacks',
    example: 'https://your-domain.com/webhook',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  webhookUrl?: string;
}
