import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create KieAI provider
  const kieProvider = await prisma.provider.upsert({
    where: { slug: 'kie.ai' },
    update: {},
    create: {
      name: 'KieAI',
      slug: 'kie.ai',
      baseUrl: 'https://api.kie.ai/api/v1',
      description: 'KieAI provides access to Flux, Runway, Sora, and other AI models',
      status: 'ACTIVE',
    },
  });

  // Create GeminiGen provider
  const geminiProvider = await prisma.provider.upsert({
    where: { slug: 'geminigen.ai' },
    update: {},
    create: {
      name: 'GeminiGen',
      slug: 'geminigen.ai',
      baseUrl: 'https://api.geminigen.ai/uapi/v1',
      description: 'GeminiGen provides image generation, video generation, and text-to-speech',
      status: 'ACTIVE',
    },
  });

  // Create models for KieAI
  await prisma.aiModel.upsert({
    where: {
      providerId_slug: {
        providerId: kieProvider.id,
        slug: 'flux-kontext-pro',
      },
    },
    update: {},
    create: {
      providerId: kieProvider.id,
      name: 'Flux Kontext Pro',
      slug: 'flux-kontext-pro',
      category: 'TEXT_TO_IMAGE',
      capabilities: {
        aspectRatios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
        outputFormats: ['jpeg', 'png'],
      },
      isActive: true,
    },
  });

  await prisma.aiModel.upsert({
    where: {
      providerId_slug: {
        providerId: kieProvider.id,
        slug: 'flux-kontext-max',
      },
    },
    update: {},
    create: {
      providerId: kieProvider.id,
      name: 'Flux Kontext Max',
      slug: 'flux-kontext-max',
      category: 'TEXT_TO_IMAGE',
      capabilities: {
        aspectRatios: ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'],
        outputFormats: ['jpeg', 'png'],
      },
      isActive: true,
    },
  });

  // Create models for GeminiGen
  await prisma.aiModel.upsert({
    where: {
      providerId_slug: {
        providerId: geminiProvider.id,
        slug: 'imagen-4',
      },
    },
    update: {},
    create: {
      providerId: geminiProvider.id,
      name: 'Imagen 4',
      slug: 'imagen-4',
      category: 'TEXT_TO_IMAGE',
      capabilities: {
        aspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
        styles: ['Photorealistic', '3D Render', 'Anime General', 'Creative'],
      },
      isActive: true,
    },
  });

  await prisma.aiModel.upsert({
    where: {
      providerId_slug: {
        providerId: geminiProvider.id,
        slug: 'veo-2',
      },
    },
    update: {},
    create: {
      providerId: geminiProvider.id,
      name: 'Veo 2',
      slug: 'veo-2',
      category: 'TEXT_TO_VIDEO',
      capabilities: {
        aspectRatios: ['16:9', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [8],
      },
      isActive: true,
    },
  });

  await prisma.aiModel.upsert({
    where: {
      providerId_slug: {
        providerId: geminiProvider.id,
        slug: 'tts-flash',
      },
    },
    update: {},
    create: {
      providerId: geminiProvider.id,
      name: 'TTS Flash',
      slug: 'tts-flash',
      category: 'TEXT_TO_SPEECH_SINGLE',
      capabilities: {
        outputFormats: ['mp3', 'wav'],
        languages: ['en', 'id'],
      },
      isActive: true,
    },
  });

  // Create API keys if env variables are set
  if (process.env.KIEAI_API_KEY) {
    await prisma.apiKey.upsert({
      where: { key: process.env.KIEAI_API_KEY },
      update: {},
      create: {
        providerId: kieProvider.id,
        key: process.env.KIEAI_API_KEY,
        status: 'ACTIVE',
        priority: 1,
      },
    });
    console.log('✓ KieAI API key added');
  }

  if (process.env.GEMINIGENAI_API_KEY) {
    await prisma.apiKey.upsert({
      where: { key: process.env.GEMINIGENAI_API_KEY },
      update: {},
      create: {
        providerId: geminiProvider.id,
        key: process.env.GEMINIGENAI_API_KEY,
        status: 'ACTIVE',
        priority: 1,
      },
    });
    console.log('✓ GeminiGen API key added');
  }

  console.log('✓ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
