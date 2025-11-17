import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StandardizedResponseDto {
  @ApiProperty({ description: 'Job ID' })
  id: string;

  @ApiProperty({ description: 'Job status' })
  status: string;

  @ApiProperty({ description: 'Status percentage (0-100)' })
  statusPercentage: number;

  @ApiPropertyOptional({ description: 'Result URL (when completed)' })
  resultUrl?: string;

  @ApiPropertyOptional({ description: 'Thumbnail URL' })
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: 'Error message (when failed)' })
  errorMessage?: string;

  @ApiPropertyOptional({ description: 'Error code (when failed)' })
  errorCode?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Completion timestamp' })
  completedAt?: Date;

  @ApiProperty({ description: 'Generation category' })
  category: string;

  @ApiProperty({ description: 'Model name used' })
  modelName: string;

  @ApiProperty({ description: 'Provider name' })
  providerName: string;
}
