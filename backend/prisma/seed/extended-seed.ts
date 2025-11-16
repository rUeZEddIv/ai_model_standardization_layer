import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting extended database seed with more models...');

  // Get providers
  const kieProvider = await prisma.aiProvider.findUnique({
    where: { name: 'KIE.AI' },
  });

  const geminiGenProvider = await prisma.aiProvider.findUnique({
    where: { name: 'GeminiGen.AI' },
  });

  if (!kieProvider || !geminiGenProvider) {
    console.error('Providers not found. Run main seed first.');
    return;
  }

  // Get categories
  const textToVideoCategory = await prisma.formCategory.findUnique({
    where: { slug: 'text-to-video' },
  });

  const textToSpeechCategory = await prisma.formCategory.findUnique({
    where: { slug: 'text-to-speech' },
  });

  if (!textToVideoCategory || !textToSpeechCategory) {
    console.error('Categories not found. Run main seed first.');
    return;
  }

  // Add more Text to Video models
  const soraProTextToVideo = await prisma.aiModel.upsert({
    where: {
      providerId_modelIdentifier: {
        providerId: kieProvider.id,
        modelIdentifier: 'sora-2-pro-text-to-video',
      },
    },
    update: {},
    create: {
      providerId: kieProvider.id,
      modelIdentifier: 'sora-2-pro-text-to-video',
      displayName: 'Sora 2 Pro - Text to Video',
      categoryId: textToVideoCategory.id,
      isActive: true,
      apiEndpoint: '/api/v1/jobs/createTask',
      supportedFeatures: {
        maxPromptLength: 10000,
        aspectRatios: ['portrait', 'landscape'],
        durations: ['10', '15', '25'],
        resolutions: ['standard', 'high'],
      },
    },
  });

  const veo3 = await prisma.aiModel.upsert({
    where: {
      providerId_modelIdentifier: {
        providerId: geminiGenProvider.id,
        modelIdentifier: 'veo-3',
      },
    },
    update: {},
    create: {
      providerId: geminiGenProvider.id,
      modelIdentifier: 'veo-3',
      displayName: 'Veo 3 - Video Generation',
      categoryId: textToVideoCategory.id,
      isActive: true,
      apiEndpoint: '/uapi/v1/video-gen/veo',
      supportedFeatures: {
        maxPromptLength: 10000,
        aspectRatios: ['1:1', '16:9', '9:16'],
        durations: ['3s', '5s', '8s'],
      },
    },
  });

  // Add Text to Speech models
  const ttsFlash = await prisma.aiModel.upsert({
    where: {
      providerId_modelIdentifier: {
        providerId: geminiGenProvider.id,
        modelIdentifier: 'tts-flash',
      },
    },
    update: {},
    create: {
      providerId: geminiGenProvider.id,
      modelIdentifier: 'tts-flash',
      displayName: 'TTS Flash - Fast Text to Speech',
      categoryId: textToSpeechCategory.id,
      isActive: true,
      apiEndpoint: '/uapi/v1/text-to-speech',
      supportedFeatures: {
        maxTextLength: 10000,
        languages: ['en', 'id', 'es', 'fr', 'de'],
        outputFormats: ['mp3', 'wav'],
        speedRange: { min: 0.5, max: 4.0 },
      },
    },
  });

  console.log('Created additional models:');
  console.log('- Sora 2 Pro Text to Video');
  console.log('- Veo 3 Video Generation');
  console.log('- TTS Flash');

  // Add field mappings for Sora 2 Pro
  await prisma.modelFieldMapping.createMany({
    data: [
      {
        modelId: soraProTextToVideo.id,
        fieldName: 'prompt',
        fieldType: 'textarea',
        isRequired: true,
        validationRules: { maxLength: 10000 },
        providerFieldName: 'prompt',
      },
      {
        modelId: soraProTextToVideo.id,
        fieldName: 'aspectRatio',
        fieldType: 'select',
        isRequired: true,
        validationRules: {
          options: [
            { value: 'portrait', label: 'Portrait' },
            { value: 'landscape', label: 'Landscape' },
          ],
        },
        providerFieldName: 'aspectRatio',
      },
      {
        modelId: soraProTextToVideo.id,
        fieldName: 'duration',
        fieldType: 'select',
        isRequired: true,
        defaultValue: '10',
        validationRules: {
          options: [
            { value: '10', label: '10 seconds' },
            { value: '15', label: '15 seconds' },
            { value: '25', label: '25 seconds' },
          ],
        },
        providerFieldName: 'nFrames',
      },
      {
        modelId: soraProTextToVideo.id,
        fieldName: 'size',
        fieldType: 'select',
        isRequired: false,
        defaultValue: 'standard',
        validationRules: {
          options: [
            { value: 'standard', label: 'Standard Quality' },
            { value: 'high', label: 'High Quality' },
          ],
        },
        providerFieldName: 'size',
      },
      {
        modelId: soraProTextToVideo.id,
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

  // Add field mappings for TTS Flash
  await prisma.modelFieldMapping.createMany({
    data: [
      {
        modelId: ttsFlash.id,
        fieldName: 'text',
        fieldType: 'textarea',
        isRequired: true,
        validationRules: { maxLength: 10000 },
        providerFieldName: 'text',
      },
      {
        modelId: ttsFlash.id,
        fieldName: 'voiceId',
        fieldType: 'select',
        isRequired: true,
        validationRules: {
          options: [
            { value: 'voice-1', label: 'Voice 1 (Female)' },
            { value: 'voice-2', label: 'Voice 2 (Male)' },
            { value: 'voice-3', label: 'Voice 3 (Female)' },
            { value: 'voice-4', label: 'Voice 4 (Male)' },
          ],
        },
        providerFieldName: 'voiceId',
      },
      {
        modelId: ttsFlash.id,
        fieldName: 'language',
        fieldType: 'select',
        isRequired: false,
        defaultValue: 'en',
        validationRules: {
          options: [
            { value: 'en', label: 'English' },
            { value: 'id', label: 'Indonesian' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
          ],
        },
        providerFieldName: 'language',
      },
      {
        modelId: ttsFlash.id,
        fieldName: 'speed',
        fieldType: 'number',
        isRequired: false,
        defaultValue: '1.0',
        validationRules: { min: 0.5, max: 4.0, step: 0.1 },
        providerFieldName: 'speed',
      },
      {
        modelId: ttsFlash.id,
        fieldName: 'outputFormat',
        fieldType: 'select',
        isRequired: false,
        defaultValue: 'mp3',
        validationRules: {
          options: [
            { value: 'mp3', label: 'MP3' },
            { value: 'wav', label: 'WAV' },
          ],
        },
        providerFieldName: 'outputFormat',
      },
      {
        modelId: ttsFlash.id,
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

  console.log('Field mappings created for new models');
  console.log('Extended seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error in extended seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
