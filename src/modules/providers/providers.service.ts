import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { ProviderStatus } from '@prisma/client';

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async createProvider(data: {
    name: string;
    slug: string;
    baseUrl: string;
    description?: string;
  }) {
    return this.prisma.provider.create({
      data: {
        ...data,
        status: ProviderStatus.ACTIVE,
      },
    });
  }

  async listProviders() {
    return this.prisma.provider.findMany({
      include: {
        models: true,
        apiKeys: {
          select: {
            id: true,
            status: true,
            priority: true,
          },
        },
      },
    });
  }

  async getProvider(id: string) {
    return this.prisma.provider.findUnique({
      where: { id },
      include: {
        models: true,
        apiKeys: true,
      },
    });
  }

  async updateProvider(
    id: string,
    data: {
      name?: string;
      baseUrl?: string;
      status?: ProviderStatus;
      description?: string;
    },
  ) {
    return this.prisma.provider.update({
      where: { id },
      data,
    });
  }

  async deleteProvider(id: string) {
    return this.prisma.provider.delete({
      where: { id },
    });
  }
}
