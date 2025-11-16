import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create AI Providers
  const kieProvider = await prisma.aiProvider.upsert({
    where: { name: 'KIE.AI' },
    update: {},
    create: {
      name: 'KIE.AI',
      baseUrl: 'https://api.kie.ai',
      authType: 'Bearer',
      isActive: true,
    },
  });

  const geminiGenProvider = await prisma.aiProvider.upsert({
    where: { name: 'GeminiGen.AI' },
    update: {},
    create: {
      name: 'GeminiGen.AI',
      baseUrl: 'https://api.geminigen.ai',
      authType: 'API-Key',
      isActive: true,
    },
  });

  console.log('Providers created');

  // Create Form Categories
  const textToImageCategory = await prisma.formCategory.upsert({
    where: { slug: 'text-to-image' },
    update: {},
    create: {
      name: 'Text to Image',
      slug: 'text-to-image',
      description: 'Generate images from text descriptions',
      inputSchema: {
        fields: ['prompt', 'aspectRatio', 'resolution', 'seed', 'numberOfGenerations', 'isPublic'],
      },
    },
  });

  const imageToImageCategory = await prisma.formCategory.upsert({
    where: { slug: 'image-to-image' },
    update: {},
    create: {
      name: 'Image to Image',
      slug: 'image-to-image',
      description: 'Transform or edit existing images',
      inputSchema: {
        fields: ['uploadedImages', 'prompt', 'aspectRatio', 'numberOfGenerations', 'isPublic'],
      },
    },
  });

  const textToVideoCategory = await prisma.formCategory.upsert({
    where: { slug: 'text-to-video' },
    update: {},
    create: {
      name: 'Text to Video',
      slug: 'text-to-video',
      description: 'Generate videos from text descriptions',
      inputSchema: {
        fields: ['prompt', 'duration', 'aspectRatio', 'resolution', 'numberOfGenerations', 'isPublic'],
      },
    },
  });

  const imageToVideoCategory = await prisma.formCategory.upsert({
    where: { slug: 'image-to-video' },
    update: {},
    create: {
      name: 'Image to Video',
      slug: 'image-to-video',
      description: 'Generate videos from images',
      inputSchema: {
        fields: ['uploadedImages', 'duration', 'aspectRatio', 'numberOfGenerations', 'isPublic'],
      },
    },
  });

  const textToSpeechCategory = await prisma.formCategory.upsert({
    where: { slug: 'text-to-speech' },
    update: {},
    create: {
      name: 'Text to Speech',
      slug: 'text-to-speech',
      description: 'Convert text to natural-sounding speech',
      inputSchema: {
        fields: ['text', 'voiceId', 'language', 'speed', 'outputFormat', 'isPublic'],
      },
    },
  });

  console.log('Categories created');

  // Create AI Models - Text to Image
  const qwenTextToImage = await prisma.aiModel.upsert({
    where: {
      providerId_modelIdentifier: {
        providerId: kieProvider.id,
        modelIdentifier: 'qwen/text-to-image',
      },
    },
    update: {},
    create: {
      providerId: kieProvider.id,
      modelIdentifier: 'qwen/text-to-image',
      displayName: 'Qwen Text to Image',
      categoryId: textToImageCategory.id,
      isActive: true,
      apiEndpoint: '/api/v1/jobs/createTask',
      supportedFeatures: {
        maxPromptLength: 5000,
        aspectRatios: ['1:1', '4:3', '16:9', '9:16'],
        resolutions: ['1024x1024', '1920x1080'],
      },
    },
  });

  const imagenFlash = await prisma.aiModel.upsert({
    where: {
      providerId_modelIdentifier: {
        providerId: geminiGenProvider.id,
        modelIdentifier: 'imagen-flash',
      },
    },
    update: {},
    create: {
      providerId: geminiGenProvider.id,
      modelIdentifier: 'imagen-flash',
      displayName: 'Imagen Flash',
      categoryId: textToImageCategory.id,
      isActive: true,
      apiEndpoint: '/uapi/v1/generate_image',
      supportedFeatures: {
        maxPromptLength: 10000,
        aspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
        styles: ['Photorealistic', '3D Render', 'Anime General'],
      },
    },
  });

  console.log('AI Models created');

  // Create field mappings for Qwen Text to Image
  await prisma.modelFieldMapping.createMany({
    data: [
      {
        modelId: qwenTextToImage.id,
        fieldName: 'prompt',
        fieldType: 'textarea',
        isRequired: true,
        validationRules: { maxLength: 5000 },
        providerFieldName: 'prompt',
      },
      {
        modelId: qwenTextToImage.id,
        fieldName: 'aspectRatio',
        fieldType: 'select',
        isRequired: true,
        validationRules: {
          options: [
            { value: '1:1', label: '1:1 (Square)' },
            { value: '4:3', label: '4:3' },
            { value: '16:9', label: '16:9 (Landscape)' },
            { value: '9:16', label: '9:16 (Portrait)' },
          ],
        },
        providerFieldName: 'aspectRatio',
      },
      {
        modelId: qwenTextToImage.id,
        fieldName: 'numberOfGenerations',
        fieldType: 'select',
        isRequired: true,
        defaultValue: '1',
        validationRules: {
          options: [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
          ],
        },
        providerFieldName: 'num',
      },
      {
        modelId: qwenTextToImage.id,
        fieldName: 'seed',
        fieldType: 'number',
        isRequired: false,
        validationRules: { min: 0, max: 2147483647 },
        providerFieldName: 'seed',
      },
      {
        modelId: qwenTextToImage.id,
        fieldName: 'negativePrompt',
        fieldType: 'textarea',
        isRequired: false,
        validationRules: { maxLength: 500 },
        providerFieldName: 'negativePrompt',
      },
      {
        modelId: qwenTextToImage.id,
        fieldName: 'isPublic',
        fieldType: 'boolean',
        isRequired: true,
        defaultValue: 'false',
        validationRules: {},
        providerFieldName: 'isPublic',
      },
    ],
    skipDuplicates: true,
  });

  // Create field mappings for Imagen Flash
  await prisma.modelFieldMapping.createMany({
    data: [
      {
        modelId: imagenFlash.id,
        fieldName: 'prompt',
        fieldType: 'textarea',
        isRequired: true,
        validationRules: { maxLength: 10000 },
        providerFieldName: 'prompt',
      },
      {
        modelId: imagenFlash.id,
        fieldName: 'aspectRatio',
        fieldType: 'select',
        isRequired: true,
        validationRules: {
          options: [
            { value: '1:1', label: '1:1 (Square)' },
            { value: '16:9', label: '16:9 (Landscape)' },
            { value: '9:16', label: '9:16 (Portrait)' },
            { value: '4:3', label: '4:3' },
            { value: '3:4', label: '3:4' },
          ],
        },
        providerFieldName: 'aspectRatio',
      },
      {
        modelId: imagenFlash.id,
        fieldName: 'style',
        fieldType: 'select',
        isRequired: false,
        validationRules: {
          options: [
            { value: 'Photorealistic', label: 'Photorealistic' },
            { value: '3D Render', label: '3D Render' },
            { value: 'Anime General', label: 'Anime General' },
          ],
        },
        providerFieldName: 'style',
      },
      {
        modelId: imagenFlash.id,
        fieldName: 'numberOfGenerations',
        fieldType: 'select',
        isRequired: true,
        defaultValue: '1',
        validationRules: {
          options: [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
          ],
        },
        providerFieldName: 'numberOfGenerations',
      },
      {
        modelId: imagenFlash.id,
        fieldName: 'isPublic',
        fieldType: 'boolean',
        isRequired: true,
        defaultValue: 'false',
        validationRules: {},
        providerFieldName: 'isPublic',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Field mappings created');
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
