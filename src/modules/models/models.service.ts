import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { GenerationCategory } from '@prisma/client';

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async createModel(data: {
    providerId: string;
    name: string;
    slug: string;
    category: GenerationCategory;
    capabilities?: any;
  }) {
    return this.prisma.aiModel.create({
      data: {
        ...data,
        capabilities: data.capabilities || {},
        isActive: true,
      },
    });
  }

  async listModels(filters?: {
    providerId?: string;
    category?: GenerationCategory;
    isActive?: boolean;
  }) {
    return this.prisma.aiModel.findMany({
      where: {
        providerId: filters?.providerId,
        category: filters?.category,
        isActive: filters?.isActive,
      },
      include: {
        provider: true,
      },
    });
  }

  async getModel(id: string) {
    return this.prisma.aiModel.findUnique({
      where: { id },
      include: {
        provider: true,
      },
    });
  }

  async updateModel(
    id: string,
    data: {
      name?: string;
      isActive?: boolean;
      capabilities?: any;
    },
  ) {
    return this.prisma.aiModel.update({
      where: { id },
      data,
    });
  }

  async deleteModel(id: string) {
    return this.prisma.aiModel.delete({
      where: { id },
    });
  }
}
