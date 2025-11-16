import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { WebhookService } from '../services';

@ApiTags('webhooks')
@Controller('api/v1/webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('provider-callback/:jobId')
  @ApiOperation({ summary: 'Receive webhook callback from AI provider' })
  @ApiBody({ description: 'Provider-specific webhook payload', type: Object })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async handleProviderCallback(
    @Param('jobId') jobId: string,
    @Body() payload: any,
  ) {
    await this.webhookService.handleProviderCallback(jobId, payload);

    return {
      message: 'Webhook processed successfully',
      jobId,
    };
  }
}
