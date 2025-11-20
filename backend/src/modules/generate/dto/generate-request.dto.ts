import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateRequestDto {
  @ApiProperty({
    description: 'Category ID (slug)',
    example: 'text-to-image',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    description: 'AI Model ID',
    example: 'uuid-of-model',
  })
  @IsString()
  @IsNotEmpty()
  aiModelId: string;

  @ApiProperty({
    description: 'Dynamic data based on form schema',
    example: {
      prompt: 'A beautiful sunset over mountains',
      aspectRatio: '16:9',
      isPublic: false,
    },
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;
}

export class GenerateResponseDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 'uuid-transaction-id',
  })
  transactionId: string;

  @ApiProperty({
    description: 'Provider task ID',
    example: 'task12345',
  })
  taskId: string;

  @ApiProperty({
    description: 'Status of the generation request',
    example: 'PENDING',
  })
  status: string;

  @ApiProperty({
    description: 'Message',
    example: 'Generation request submitted successfully',
  })
  message: string;
}
