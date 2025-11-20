# AI Content Generation Gateway - Backend API

A NestJS-based backend API gateway that manages AI content generation across 10 categories with server-driven UI capabilities.

## 🚀 Features

- **Server-Driven UI**: Dynamic form schemas based on AI model capabilities
- **Multi-Provider Support**: Integrates KIE.AI and GeminiGen.AI
- **10 Content Categories**: Text-to-Image, Image-to-Image, Text-to-Video, Image-to-Video, Audio-to-Video, Storyboard-to-Video, Text-to-Music, Speech-to-Text, Text-to-Speech (Single & Multiple Speakers)
- **Adapter Pattern**: Standardized interface for multiple AI providers
- **Dynamic Capabilities**: JSONB-based model capabilities stored in PostgreSQL
- **Webhook Support**: Unified callback handling for all providers
- **Swagger Documentation**: Auto-generated API documentation

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (for BullMQ - future use)

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up the database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (when PostgreSQL is available)
npx prisma migrate dev --name init

# Seed the database
npx ts-node prisma/seed/seed.ts
```

## 🏃 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at:
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs

## 📚 API Endpoints

### Forms API

**GET /api/v1/forms/{categorySlug}/schema**
- Get dynamic form schema for a category
- Query params: `?aiModelId={id}` (optional)
- Returns form fields based on AI model capabilities

Example:
```bash
# Get available models for text-to-image
curl http://localhost:3000/api/v1/forms/text-to-image/schema

# Get form schema for specific model
curl http://localhost:3000/api/v1/forms/text-to-image/schema?aiModelId=uuid-here
```

### Generation API

**POST /api/v1/generate**
- Unified endpoint for all content generation
- Validates input against model capabilities
- Returns transaction ID and provider task ID

Example:
```bash
curl -X POST http://localhost:3000/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "text-to-image",
    "aiModelId": "uuid-of-model",
    "data": {
      "prompt": "A beautiful sunset over mountains",
      "aspectRatio": "16:9",
      "isPublic": false
    }
  }'
```

### Webhook API

**POST /api/v1/webhook/callback**
- Handles callbacks from AI providers
- Auto-detects provider from payload
- Updates transaction status

## 🗄️ Database Schema

The system uses PostgreSQL with the following main tables:

- **ai_providers**: AI service providers (KIE.AI, GeminiGen.AI)
- **form_categories**: 10 content generation categories
- **ai_models**: AI models with JSONB capabilities
- **transactions**: Generation request tracking

### Key Features:
- JSONB for dynamic capabilities
- Flexible schema for provider-specific configurations
- Transaction tracking with status updates

## 🏗️ Architecture

### Adapter Pattern
- `BaseAIAdapter`: Common interface
- `KieAdapter`: KIE.AI implementation
- `GeminiGenAdapter`: GeminiGen.AI implementation

### Server-Driven UI
- Frontend receives form schemas from backend
- No hardcoded form logic in frontend
- Dynamic field validation based on model capabilities

### Modules
- **FormsModule**: Dynamic form schema generation
- **GenerateModule**: Content generation orchestration
- **WebhookModule**: Provider callback handling
- **PrismaModule**: Database access

## 🔒 Security

- API keys encrypted in database
- Environment variable configuration
- Input validation with class-validator
- CORS enabled for frontend integration

## 📝 Available Categories

1. **text-to-image**: Generate images from text
2. **image-to-image**: Transform images with prompts
3. **text-to-video**: Create videos from text
4. **image-to-video**: Animate images
5. **audio-to-video**: Videos from audio
6. **storyboard-to-video**: Multi-scene video generation
7. **text-to-music**: Generate music
8. **speech-to-text**: Audio transcription
9. **text-to-speech**: Single speaker TTS
10. **text-to-speech-multi**: Multiple speaker TTS

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📖 Documentation

Visit `/api/docs` when running the application to access Swagger documentation.

## 🤝 Contributing

This is a standardization layer for AI content generation. Follow the adapter pattern when adding new providers.

## 📄 License

MIT
