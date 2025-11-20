import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';

@ApiTags('Webhook')
@Controller('api/v1/webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('callback')
  @ApiOperation({
    summary: 'Handle webhook callbacks from AI providers',
    description:
      'Unified webhook endpoint for KIE.AI, GeminiGen.AI and other providers',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async handleCallback(
    @Body() payload: any,
    @Headers('x-provider') providerHeader?: string,
  ): Promise<{ message: string }> {
    return this.webhookService.handleCallback(payload, providerHeader);
  }
}
