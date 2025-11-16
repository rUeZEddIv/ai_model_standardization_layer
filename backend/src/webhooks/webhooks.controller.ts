import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { ApiResponse as ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('kie')
  @ApiOperation({ summary: 'Receive webhooks from KIE.AI' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  async handleKieWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature?: string,
  ) {
    this.logger.log('Received KIE.AI webhook');
    const result = await this.webhooksService.handleKieWebhook(payload, signature);
    return ApiResponseDto.success(result);
  }

  @Post('geminigen')
  @ApiOperation({ summary: 'Receive webhooks from GeminiGen.AI' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  async handleGeminiGenWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature?: string,
  ) {
    this.logger.log('Received GeminiGen.AI webhook');
    const result = await this.webhooksService.handleGeminiGenWebhook(payload, signature);
    return ApiResponseDto.success(result);
  }

  @Post()
  @ApiOperation({ summary: 'Generic webhook receiver (auto-detect provider)' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  async handleGenericWebhook(
    @Body() payload: any,
    @Headers('x-signature') signature?: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    this.logger.log(`Received webhook from user-agent: ${userAgent}`);

    // Auto-detect provider based on payload structure or user-agent
    if (payload.taskId && !payload.id) {
      // Likely KIE.AI
      const result = await this.webhooksService.handleKieWebhook(payload, signature);
      return ApiResponseDto.success(result);
    } else if (payload.id || payload.taskId) {
      // Likely GeminiGen.AI
      const result = await this.webhooksService.handleGeminiGenWebhook(payload, signature);
      return ApiResponseDto.success(result);
    }

    return ApiResponseDto.error('UNKNOWN_PROVIDER', 'Could not determine webhook provider');
  }
}
