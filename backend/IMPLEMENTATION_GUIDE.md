# AI Content Generation Platform - Complete Implementation Guide

## Overview

This platform provides a unified API for generating AI content (images, videos, audio, text) by integrating multiple AI providers (KIE.AI and GeminiGen.AI) through a standardized backend built with NestJS and PostgreSQL.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
│  (11 Form Categories with Dynamic Field Generation)          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              NestJS Backend API Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Forms API    │  │ Generations  │  │ Webhooks     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ KIE Adapter  │  │GeminiGen     │                       │
│  │              │  │Adapter       │                       │
│  └──────────────┘  └──────────────┘                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  (Prisma ORM - 8 tables)                                    │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema

### Tables

1. **ai_providers** - AI service providers (KIE.AI, GeminiGen.AI)
2. **ai_models** - AI models from each provider
3. **form_categories** - 11 generation categories
4. **model_field_mappings** - Dynamic form fields per model
5. **generation_tasks** - User generation requests
6. **generation_results** - Generated content URLs
7. **api_keys** - Provider API keys (encrypted)
8. **webhook_logs** - Webhook event logs

### Relationships

```
ai_providers (1) ──→ (N) ai_models
ai_providers (1) ──→ (N) api_keys
form_categories (1) ──→ (N) ai_models
ai_models (1) ──→ (N) model_field_mappings
ai_models (1) ──→ (N) generation_tasks
generation_tasks (1) ──→ (N) generation_results
generation_tasks (1) ──→ (N) webhook_logs
```

## API Endpoints

### 1. Form Schema & Categories

#### GET /api/v1/forms/categories
List all available form categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Text to Image",
      "slug": "text-to-image",
      "description": "Generate images from text descriptions"
    }
  ]
}
```

#### GET /api/v1/forms/models?categoryId={categoryId}
List all AI models, optionally filtered by category.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Qwen Text to Image",
      "identifier": "qwen/text-to-image",
      "provider": "KIE.AI",
      "category": "Text to Image",
      "categorySlug": "text-to-image",
      "supportedFeatures": {
        "maxPromptLength": 5000,
        "aspectRatios": ["1:1", "16:9"]
      }
    }
  ]
}
```

#### GET /api/v1/forms/:categoryId/schema?modelId={modelId}
Get dynamic form schema for a specific model.

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "Text to Image",
    "slug": "text-to-image",
    "model": {
      "id": "uuid",
      "name": "Qwen Text to Image",
      "identifier": "qwen/text-to-image",
      "provider": "KIE.AI"
    },
    "fields": [
      {
        "name": "prompt",
        "type": "textarea",
        "label": "Prompt",
        "required": true,
        "validation": { "maxLength": 5000 }
      },
      {
        "name": "aspectRatio",
        "type": "select",
        "label": "Aspect Ratio",
        "required": true,
        "validation": {
          "options": [
            { "value": "1:1", "label": "1:1 (Square)" },
            { "value": "16:9", "label": "16:9 (Landscape)" }
          ]
        }
      }
    ]
  }
}
```

### 2. Generation Tasks

#### POST /api/v1/generations
Create a new generation task.

**Request:**
```json
{
  "category": "text-to-image",
  "aiModelId": "uuid-of-model",
  "input": {
    "prompt": "A beautiful sunset over mountains",
    "aspectRatio": "16:9",
    "numberOfGenerations": 1,
    "isPublic": false
  },
  "webhookUrl": "https://your-domain.com/webhook"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "uuid",
    "status": "pending",
    "estimatedCompletionTime": "2025-01-20T10:30:00Z",
    "pollingUrl": "/api/v1/generations/uuid",
    "createdAt": "2025-01-20T10:00:00Z"
  }
}
```

#### GET /api/v1/generations/:taskId
Get generation task status and results.

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "uuid",
    "status": "completed",
    "progress": 100,
    "results": [
      {
        "fileUrl": "https://cdn.example.com/image.png",
        "fileType": "image",
        "thumbnailUrl": "https://cdn.example.com/thumb.png",
        "metadata": {}
      }
    ],
    "error": null,
    "createdAt": "2025-01-20T10:00:00Z",
    "updatedAt": "2025-01-20T10:05:00Z",
    "completedAt": "2025-01-20T10:05:00Z"
  }
}
```

### 3. Webhooks

#### POST /api/v1/webhooks/kie
Receive webhooks from KIE.AI.

#### POST /api/v1/webhooks/geminigen
Receive webhooks from GeminiGen.AI.

#### POST /api/v1/webhooks
Generic webhook endpoint (auto-detects provider).

**Webhook Payload Example:**
```json
{
  "taskId": "provider-task-id",
  "status": "completed",
  "outputUrl": "https://cdn.example.com/result.png",
  "metadata": {}
}
```

## Provider Adapters

### KIE.AI Adapter

**Features:**
- Bearer token authentication
- API key rotation
- Endpoints:
  - Create Task: `POST /api/v1/jobs/createTask`
  - Get Status: `GET /api/v1/jobs/recordInfo?taskId={taskId}`

**Supported Models:**
- Text to Image: qwen/text-to-image, grok-imagine/text-to-image, flux-kontext, 4o-image, ideogram
- Text to Video: grok-imagine, sora-2, bytedance, kling, wan, runway
- Image to Video: Similar to text-to-video with image input
- Text to Music: Suno API (V3_5, V4, V4_5, V4_5PLUS, V5)

### GeminiGen.AI Adapter

**Features:**
- x-api-key header authentication
- API key rotation
- Endpoints vary by service:
  - Text to Speech: `POST /uapi/v1/text-to-speech`
  - Image Generation: `POST /uapi/v1/generate_image`
  - Video Generation: `POST /uapi/v1/video-gen/veo`

**Supported Models:**
- Text to Image: imagen-flash, imagen-4, imagen-4-fast, imagen-4-ultra
- Text to Video: veo-2, veo-3, veo-3-fast
- Text to Speech: tts-flash, tts-pro
- Dialogue: tts-multi-speaker

## Form Categories

### 1. Text to Image
Generate images from text descriptions.

**Common Fields:**
- prompt (required)
- aspectRatio (required)
- resolution (optional)
- seed (optional)
- numberOfGenerations (required)
- isPublic (required)

**Model-specific:**
- negativePrompt (KIE models)
- style (GeminiGen models)
- numInferenceSteps (Qwen)

### 2. Image to Image
Transform or edit existing images.

**Fields:**
- uploadedImages (required, array)
- prompt (required)
- aspectRatio (required)
- Other fields similar to text-to-image

### 3. Text to Video
Generate videos from text descriptions.

**Fields:**
- prompt (required)
- duration (required)
- aspectRatio (required)
- resolution (optional)
- numberOfGenerations (required)
- isPublic (required)

### 4. Image to Video
Generate videos from images.

**Fields:**
- uploadedImages (required)
- duration (required)
- aspectRatio (required)
- Other fields similar to text-to-video

### 5. Audio to Video
Generate videos with audio input.

**Fields:**
- uploadedAudio (required)
- uploadedImage (optional)
- prompt (required)
- aspectRatio (required)

### 6. Storyboard to Video
Create videos from multiple scenes.

**Fields:**
- scenes (array, required)
  - sceneImage (optional)
  - prompt (required)
  - duration (required)
- aspectRatio (required)

### 7. Text to Music
Generate music from descriptions.

**Fields:**
- title (required)
- musicStyle (required)
- isInstrumental (required)
- lyrics (conditional)
- vocalGender (optional)

### 8. Speech to Text
Transcribe audio to text.

**Fields:**
- uploadedAudio (required)
- language (optional)

### 9. Text to Speech (Single Speaker)
Convert text to speech with one voice.

**Fields:**
- text (required)
- voiceId (required)
- language (optional)
- speed (optional)
- outputFormat (optional)

### 10. Text to Speech (Multiple Speakers)
Create dialogue with multiple voices.

**Fields:**
- speakers (array, required)
  - text (required)
  - voiceId (required)
- language (optional)
- speed (optional)

### 11. Document to Speech
Convert documents to audio.

**Fields:**
- uploadedDocument (required)
- voiceId (required)
- language (optional)
- speed (optional)

## Setup & Deployment

### Development Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Setup database:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Start development server:**
   ```bash
   npm run start:dev
   ```

### Production Deployment

1. **Build application:**
   ```bash
   npm run build
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Seed database:**
   ```bash
   npm run prisma:seed
   ```

4. **Start production server:**
   ```bash
   npm run start:prod
   ```

## Environment Variables

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `KIE_API_KEYS` - Comma-separated KIE.AI API keys
- `GEMINIGEN_API_KEYS` - Comma-separated GeminiGen.AI API keys

Optional variables:
- `API_PORT` - Default: 3000
- `JWT_SECRET` - For authentication
- `WEBHOOK_SECRET` - For webhook verification
- `FILE_STORAGE_TYPE` - local, s3, cloudinary
- `REDIS_HOST` - For queue system

## Security Considerations

1. **API Key Management:**
   - Store encrypted in database
   - Rotate regularly
   - Use environment variables for sensitive keys

2. **Webhook Security:**
   - Verify signatures (TODO: implement)
   - Use HTTPS only
   - Rate limiting

3. **Input Validation:**
   - All inputs validated with class-validator
   - File type and size restrictions
   - SQL injection prevention (Prisma ORM)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Monitoring & Logging

- All requests logged
- Task lifecycle events tracked
- Webhook events stored in database
- Error tracking with context

## Future Enhancements

1. **Queue System:** Implement BullMQ for async processing
2. **File Upload:** Direct file upload support
3. **Caching:** Redis caching for frequently accessed data
4. **Rate Limiting:** Per-user and per-IP limits
5. **Authentication:** JWT-based user authentication
6. **Analytics:** Usage tracking and reporting
7. **Batch Operations:** Multiple generations in one request
8. **Templates:** Pre-configured generation templates

## Support

For issues or questions, please refer to the API documentation at `/api/docs` when running the server.
