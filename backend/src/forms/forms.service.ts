import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async getFormSchema(categoryId: string, modelId?: string) {
    const category = await this.prisma.formCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category '${categoryId}' not found`);
    }

    if (!modelId) {
      // Return basic category schema
      return {
        category: category.name,
        slug: category.slug,
        description: category.description,
        inputSchema: category.inputSchema,
      };
    }

    // Get model-specific schema
    const model = await this.prisma.aiModel.findUnique({
      where: { id: modelId },
      include: {
        fieldMappings: true,
        provider: true,
      },
    });

    if (!model) {
      throw new NotFoundException(`Model '${modelId}' not found`);
    }

    const fields = model.fieldMappings.map((mapping) => ({
      name: mapping.fieldName,
      type: mapping.fieldType,
      label: this.formatLabel(mapping.fieldName),
      required: mapping.isRequired,
      defaultValue: mapping.defaultValue,
      validation: mapping.validationRules,
    }));

    return {
      category: category.name,
      slug: category.slug,
      model: {
        id: model.id,
        name: model.displayName,
        identifier: model.modelIdentifier,
        provider: model.provider.name,
      },
      fields,
    };
  }

  async getCategories() {
    const categories = await this.prisma.formCategory.findMany({
      orderBy: { name: 'asc' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
    }));
  }

  async getModels(categoryId?: string) {
    const where = categoryId ? { categoryId, isActive: true } : { isActive: true };

    const models = await this.prisma.aiModel.findMany({
      where,
      include: {
        provider: true,
        category: true,
      },
      orderBy: { displayName: 'asc' },
    });

    return models.map((model) => ({
      id: model.id,
      name: model.displayName,
      identifier: model.modelIdentifier,
      provider: model.provider.name,
      category: model.category.name,
      categorySlug: model.category.slug,
      supportedFeatures: model.supportedFeatures,
    }));
  }

  private formatLabel(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}
