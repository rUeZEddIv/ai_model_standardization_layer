import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { ApiKeyStatus } from '@prisma/client';

@ApiTags('API Keys')
@Controller('api/v1/api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  async createApiKey(
    @Body()
    data: {
      providerId: string;
      key: string;
      priority?: number;
    },
  ) {
    return this.apiKeysService.createApiKey(
      data.providerId,
      data.key,
      data.priority,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List API keys' })
  async listApiKeys(@Query('providerId') providerId?: string) {
    return this.apiKeysService.listApiKeys(providerId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update API key status' })
  async updateApiKeyStatus(
    @Param('id') id: string,
    @Body() data: { status: ApiKeyStatus },
  ) {
    return this.apiKeysService.updateApiKeyStatus(id, data.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete API key' })
  async deleteApiKey(@Param('id') id: string) {
    await this.apiKeysService.deleteApiKey(id);
    return { success: true };
  }
}
