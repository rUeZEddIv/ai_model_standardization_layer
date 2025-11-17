import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [ModelsController],
  providers: [ModelsService, PrismaService],
  exports: [ModelsService],
})
export class ModelsModule {}
