import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create AI Providers
  const kieProvider = await prisma.aIProvider.upsert({
    where: { slug: 'kie' },
    update: {},
    create: {
      name: 'KIE.AI',
      slug: 'kie',
      apiKey: 'encrypted-kie-api-key', // Should be encrypted in production
      baseUrl: 'https://api.kie.ai',
      isActive: true,
    },
  });

  const geminiGenProvider = await prisma.aIProvider.upsert({
    where: { slug: 'geminigen' },
    update: {},
    create: {
      name: 'GEMINIGEN.AI',
      slug: 'geminigen',
      apiKey: 'encrypted-geminigen-api-key', // Should be encrypted in production
      baseUrl: 'https://api.geminigen.ai',
      isActive: true,
    },
  });

  console.log('Providers created:', { kieProvider, geminiGenProvider });

  // Create Form Categories
  const categories = [
    { slug: 'text-to-image', name: 'Text to Image', description: 'Generate images from text descriptions' },
    { slug: 'image-to-image', name: 'Image to Image', description: 'Transform images based on text prompts' },
    { slug: 'text-to-video', name: 'Text to Video', description: 'Create videos from text descriptions' },
    { slug: 'image-to-video', name: 'Image to Video', description: 'Animate images into videos' },
    { slug: 'audio-to-video', name: 'Audio to Video', description: 'Create videos from audio files' },
    { slug: 'storyboard-to-video', name: 'Storyboard to Video', description: 'Generate videos from scene sequences' },
    { slug: 'text-to-music', name: 'Text to Music', description: 'Generate music from descriptions' },
    { slug: 'speech-to-text', name: 'Speech to Text', description: 'Transcribe audio to text' },
    { slug: 'text-to-speech', name: 'Text to Speech (Single)', description: 'Convert text to speech with single voice' },
    { slug: 'text-to-speech-multi', name: 'Text to Speech (Multi)', description: 'Convert text to speech with multiple voices' },
  ];

  const createdCategories: Array<{
    id: string;
    slug: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }> = [];
  for (const cat of categories) {
    const category = await prisma.formCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(category);
    console.log(`Category created: ${category.name}`);
  }

  // Create AI Models for Text to Image (KIE.AI - Flux Kontext)
  const textToImageCategory = createdCategories.find(c => c.slug === 'text-to-image');
  if (textToImageCategory) {
    await prisma.aIModel.upsert({
      where: { providerId_externalModelId: { providerId: kieProvider.id, externalModelId: 'flux-kontext-pro' } },
      update: {},
      create: {
        providerId: kieProvider.id,
        categoryId: textToImageCategory.id,
        externalModelId: 'flux-kontext-pro',
        name: 'Flux Kontext Pro',
        capabilities: {
          ratios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
          resolutions: ['1024x1024', '2048x2048'],
          supports_negative_prompt: false,
          max_generations: 10,
        },
        isActive: true,
      },
    });

    await prisma.aIModel.upsert({
      where: { providerId_externalModelId: { providerId: kieProvider.id, externalModelId: 'flux-kontext-max' } },
      update: {},
      create: {
        providerId: kieProvider.id,
        categoryId: textToImageCategory.id,
        externalModelId: 'flux-kontext-max',
        name: 'Flux Kontext Max',
        capabilities: {
          ratios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
          resolutions: ['1024x1024', '2048x2048', '4096x4096'],
          supports_negative_prompt: false,
          max_generations: 10,
        },
        isActive: true,
      },
    });

    // GeminiGen.AI Imagen models
    await prisma.aIModel.upsert({
      where: { providerId_externalModelId: { providerId: geminiGenProvider.id, externalModelId: 'imagen-4' } },
      update: {},
      create: {
        providerId: geminiGenProvider.id,
        categoryId: textToImageCategory.id,
        externalModelId: 'imagen-4',
        name: 'Imagen 4',
        capabilities: {
          ratios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
          styles: ['None', '3D Render', 'Acrylic', 'Anime General', 'Creative', 'Dynamic', 'Fashion', 'Photorealistic', 'Portrait', 'Watercolor'],
          supports_negative_prompt: false,
          max_generations: 4,
        },
        isActive: true,
      },
    });

    console.log('Text to Image models created');
  }

  // Create AI Models for Text to Video
  const textToVideoCategory = createdCategories.find(c => c.slug === 'text-to-video');
  if (textToVideoCategory) {
    await prisma.aIModel.upsert({
      where: { providerId_externalModelId: { providerId: kieProvider.id, externalModelId: 'sora-2-text-to-video' } },
      update: {},
      create: {
        providerId: kieProvider.id,
        categoryId: textToVideoCategory.id,
        externalModelId: 'sora-2-text-to-video',
        name: 'Sora 2 Text to Video',
        capabilities: {
          ratios: ['16:9', '9:16', '1:1'],
          durations: [5, 10, 20],
          max_duration_seconds: 20,
        },
        isActive: true,
      },
    });

    console.log('Text to Video models created');
  }

  // Create AI Models for Text to Speech
  const textToSpeechCategory = createdCategories.find(c => c.slug === 'text-to-speech');
  if (textToSpeechCategory) {
    await prisma.aIModel.upsert({
      where: { providerId_externalModelId: { providerId: geminiGenProvider.id, externalModelId: 'tts-flash' } },
      update: {},
      create: {
        providerId: geminiGenProvider.id,
        categoryId: textToSpeechCategory.id,
        externalModelId: 'tts-flash',
        name: 'TTS Flash',
        capabilities: {
          languages: ['en', 'id', 'es', 'fr', 'de', 'ja', 'ko', 'zh'],
          voices: [
            { id: 'GM013', name: 'Gacrux' },
            { id: 'GM001', name: 'Aurora' },
            { id: 'GM002', name: 'Nova' },
          ],
          styles: ['neutral', 'happy', 'sad', 'angry', 'excited'],
        },
        isActive: true,
      },
    });

    console.log('Text to Speech models created');
  }

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
