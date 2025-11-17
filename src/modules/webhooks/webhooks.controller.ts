import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';

@ApiTags('Webhooks')
@Controller('api/v1/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post(':provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle webhook from provider' })
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: any,
  ) {
    return this.webhooksService.handleWebhook(provider, payload);
  }

  @Get()
  @ApiOperation({ summary: 'List webhook events' })
  async listWebhooks(@Query('jobId') jobId?: string) {
    return this.webhooksService.listWebhooks(jobId);
  }
}
