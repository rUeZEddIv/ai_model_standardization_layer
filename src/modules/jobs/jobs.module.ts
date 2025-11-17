import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { PrismaService } from '../../common/prisma.service';
import { AdapterFactory } from '../../providers/adapters/adapter.factory';
import { ApiKeysModule } from '../api-keys/api-keys.module';

@Module({
  imports: [HttpModule, ApiKeysModule],
  controllers: [JobsController],
  providers: [JobsService, PrismaService, AdapterFactory],
  exports: [JobsService],
})
export class JobsModule {}
