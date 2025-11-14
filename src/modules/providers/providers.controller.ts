import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProvidersService } from './providers.service';

@ApiTags('Providers')
@Controller('api/v1/providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new provider' })
  async createProvider(
    @Body()
    data: {
      name: string;
      slug: string;
      baseUrl: string;
      description?: string;
    },
  ) {
    return this.providersService.createProvider(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all providers' })
  async listProviders() {
    return this.providersService.listProviders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get provider by ID' })
  async getProvider(@Param('id') id: string) {
    return this.providersService.getProvider(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update provider' })
  async updateProvider(@Param('id') id: string, @Body() data: any) {
    return this.providersService.updateProvider(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete provider' })
  async deleteProvider(@Param('id') id: string) {
    return this.providersService.deleteProvider(id);
  }
}
