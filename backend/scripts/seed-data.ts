/**
 * Sample seed data for AI Providers and Models
 * This demonstrates how the database should be populated with provider and model information
 */

export const seedProviders = [
  {
    name: 'Kie.ai',
    docsUrl: 'https://docs.kie.ai',
  },
  {
    name: 'Geminigen.ai',
    docsUrl: 'https://docs.geminigen.ai',
  },
];

export const seedModels = [
  // Kie.ai TEXT_TO_IMAGE models
  {
    providerName: 'Kie.ai',
    name: 'Kie Image Gen v2',
    modelIdentifier: 'kie-img-v2-sdxl',
    generationCategory: 'TEXT_TO_IMAGE',
    apiEndpointUrl: 'https://api.kie.ai/v1/generate/image',
    webhookCallbackUrl: 'https://api.kie.ai/v1/webhooks',
    capabilities: {
      aspectRatios: ['1:1', '16:9', '4:3', '3:4', '9:16'],
      resolutions: ['1024x1024', '1920x1080', '1080x1920', '800x600'],
      maxGenerations: 4,
      supportedFeatures: ['seed', 'numberOfGenerations'],
    },
    isActive: true,
  },
  // Geminigen.ai TEXT_TO_IMAGE models
  {
    providerName: 'Geminigen.ai',
    name: 'Geminigen SDXL',
    modelIdentifier: 'geminigen-sdxl-v1',
    generationCategory: 'TEXT_TO_IMAGE',
    apiEndpointUrl: 'https://api.geminigen.ai/v1/image/generate',
    webhookCallbackUrl: 'https://api.geminigen.ai/v1/callback',
    capabilities: {
      aspectRatios: ['1:1', '16:9', '4:3'],
      resolutions: ['512x512', '1024x1024', '1920x1080'],
      maxGenerations: 8,
      supportedFeatures: ['seed', 'numberOfGenerations', 'negativePrompt'],
    },
    isActive: true,
  },
  // Kie.ai TEXT_TO_VIDEO models
  {
    providerName: 'Kie.ai',
    name: 'Kie Sora 2 Pro',
    modelIdentifier: 'kie-sora-2-pro',
    generationCategory: 'TEXT_TO_VIDEO',
    apiEndpointUrl: 'https://api.kie.ai/v1/sora/generate',
    webhookCallbackUrl: 'https://api.kie.ai/v1/webhooks',
    capabilities: {
      aspectRatios: ['16:9', '9:16', '1:1'],
      resolutions: ['1920x1080', '1080x1920', '1024x1024'],
      durations: [5, 10, 15, 20],
      maxGenerations: 2,
      supportedFeatures: ['seed', 'duration'],
    },
    isActive: true,
  },
  // Kie.ai IMAGE_TO_IMAGE models
  {
    providerName: 'Kie.ai',
    name: 'Kie Image Editor',
    modelIdentifier: 'kie-img-edit-v1',
    generationCategory: 'IMAGE_TO_IMAGE',
    apiEndpointUrl: 'https://api.kie.ai/v1/edit/image',
    webhookCallbackUrl: 'https://api.kie.ai/v1/webhooks',
    capabilities: {
      aspectRatios: ['1:1', '16:9', '4:3', 'original'],
      resolutions: ['1024x1024', '1920x1080', 'original'],
      maxGenerations: 3,
      maxUploadSize: 10485760, // 10MB in bytes
      supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      supportedFeatures: ['seed', 'strength'],
    },
    isActive: true,
  },
  // Geminigen.ai TEXT_TO_SPEECH models
  {
    providerName: 'Geminigen.ai',
    name: 'Geminigen TTS Pro',
    modelIdentifier: 'geminigen-tts-pro-v1',
    generationCategory: 'TEXT_TO_SPEECH_SINGLE',
    apiEndpointUrl: 'https://api.geminigen.ai/v1/audio/tts',
    capabilities: {
      styles: ['formal', 'casual', 'happy', 'sad', 'excited', 'calm'],
      voices: [
        { id: 'voice_en_us_male_1', name: 'John (US Male)', gender: 'male', language: 'en-US' },
        { id: 'voice_en_us_female_1', name: 'Emma (US Female)', gender: 'female', language: 'en-US' },
        { id: 'voice_en_gb_male_1', name: 'Oliver (UK Male)', gender: 'male', language: 'en-GB' },
        { id: 'voice_en_gb_female_1', name: 'Sophie (UK Female)', gender: 'female', language: 'en-GB' },
        { id: 'voice_id_id_male_1', name: 'Budi (ID Male)', gender: 'male', language: 'id-ID' },
        { id: 'voice_id_id_female_1', name: 'Sari (ID Female)', gender: 'female', language: 'id-ID' },
      ],
      languages: ['en-US', 'en-GB', 'id-ID', 'es-ES', 'fr-FR', 'de-DE'],
      maxTextLength: 5000,
      supportedFeatures: ['style', 'speed', 'pitch'],
    },
    isActive: true,
  },
];

export const seedSampleUser = {
  email: 'demo@example.com',
  passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456', // This would be a real bcrypt hash
};

export const seedSampleCredentials = [
  {
    userEmail: 'demo@example.com',
    providerName: 'Kie.ai',
    apiKey: 'kie_demo_api_key_12345',
    nickname: 'My Kie Account',
  },
  {
    userEmail: 'demo@example.com',
    providerName: 'Geminigen.ai',
    apiKey: 'geminigen_demo_api_key_67890',
    nickname: 'My Geminigen Account',
  },
];
