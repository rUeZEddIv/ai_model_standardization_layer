# AI Model Standardization Layer

A comprehensive Backend API Gateway built with NestJS that standardizes and manages AI content generation across multiple providers with a Server-Driven UI architecture.

## 🎯 Project Overview

This project implements a centralized backend gateway that integrates various AI providers (KIE.AI, GeminiGen.AI) under a single standardized interface. It supports 10 categories of AI content generation and provides dynamic form schemas to frontend applications based on AI model capabilities.

## 🏗️ Architecture

### Core Philosophy: Server-Driven UI

The frontend is completely agnostic and contains no hardcoded logic. The backend is fully responsible for:
- Providing form structure and field types
- Dynamic validation based on model capabilities  
- Dropdown values and options
- Category-specific configurations

### Design Patterns

1. **Adapter Pattern**: Standardized interface for multiple AI providers
   - `BaseAIAdapter`: Common interface for all providers
   - `KieAdapter`: KIE.AI specific implementation
   - `GeminiGenAdapter`: GeminiGen.AI specific implementation

2. **Dynamic Capabilities Mapping**: Database-driven configuration
   - JSONB columns for model-specific capabilities
   - No hardcoded ENUMs for varying features
   - Runtime form generation based on capabilities

3. **Server-Driven Validation**: Backend validates all inputs
   - Checks against model capabilities before API calls
   - Standardized error responses
   - Transaction tracking for all requests

## 📁 Project Structure

```
.
├── backend/                     # NestJS Backend Application
│   ├── prisma/                 # Database Schema & Migrations
│   │   ├── schema.prisma      # Prisma schema with JSONB support
│   │   └── seed/              # Database seed scripts
│   ├── src/
│   │   ├── adapters/          # AI Provider Adapters
│   │   │   ├── base-ai.adapter.ts
│   │   │   ├── kie.adapter.ts
│   │   │   ├── geminigen.adapter.ts
│   │   │   └── adapter.factory.ts
│   │   ├── modules/
│   │   │   ├── forms/         # Dynamic Form Schema
│   │   │   ├── generate/      # Content Generation
│   │   │   └── webhook/       # Webhook Callbacks
│   │   ├── prisma/            # Prisma Service
│   │   └── main.ts            # Application Entry
│   └── README.md              # Backend Documentation
└── docs/                       # API Provider Documentation
    ├── kie/                   # KIE.AI API Docs
    └── geminigen/             # GeminiGen.AI API Docs
```

## 🚀 Features

### 10 Content Generation Categories

1. **Text to Image**: Generate images from text descriptions
2. **Image to Image**: Transform images with text prompts
3. **Text to Video**: Create videos from text
4. **Image to Video**: Animate static images
5. **Audio to Video**: Generate videos from audio
6. **Storyboard to Video**: Multi-scene video generation
7. **Text to Music**: AI-generated music composition
8. **Speech to Text**: Audio transcription
9. **Text to Speech (Single)**: Single voice TTS
10. **Text to Speech (Multi)**: Multiple speaker TTS

### API Endpoints

#### Dynamic Form Schema
```http
GET /api/v1/forms/{categorySlug}/schema?aiModelId={id}
```
Returns dynamic form schema based on AI model capabilities.

#### Content Generation
```http
POST /api/v1/generate
```
Unified endpoint for all content generation categories.

#### Webhook Callbacks
```http
POST /api/v1/webhook/callback
```
Handles status updates from AI providers.

## 🛠️ Tech Stack

- **Framework**: NestJS (Latest Stable)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL with JSONB
- **ORM**: Prisma
- **Validation**: class-validator, class-transformer
- **Queue**: BullMQ + Redis (configured, not yet implemented)
- **Documentation**: Swagger/OpenAPI

## 📊 Database Schema

### Tables

- **ai_providers**: AI service providers (KIE.AI, GeminiGen.AI)
- **form_categories**: 10 content generation categories
- **ai_models**: AI models with JSONB capabilities
- **transactions**: Request tracking with status

### Key Features

- JSONB for dynamic model capabilities
- Encrypted API keys
- Transaction status tracking
- Flexible schema for provider variations

## 🔧 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ai_model_standardization_layer
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Configure environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database (when PostgreSQL is available)
```bash
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed/seed.ts
```

5. Run the application
```bash
npm run start:dev
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs

## 📖 Documentation

- **Backend README**: [`/backend/README.md`](./backend/README.md)
- **Swagger API**: Available at `/api/docs` when running
- **Provider Docs**: See `/docs` folder for KIE.AI and GeminiGen.AI documentation

## 🔒 Security

- API keys encrypted in database
- Environment-based configuration
- Input validation on all endpoints
- CORS enabled for frontend integration
- No hardcoded credentials

## 🧪 Testing

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🎨 API Response Format

### Form Schema Response
```json
{
  "meta": {
    "categoryId": "text-to-image",
    "categoryName": "Text to Image",
    "selectedModel": "Flux Kontext Pro"
  },
  "schema": [
    {
      "key": "prompt",
      "label": "Deskripsi Gambar",
      "type": "textarea",
      "required": true,
      "placeholder": "Contoh: Kucing cyberpunk..."
    },
    {
      "key": "aspectRatio",
      "label": "Rasio Aspek",
      "type": "select",
      "required": true,
      "options": [
        { "label": "Persegi (1:1)", "value": "1:1" },
        { "label": "Landscape (16:9)", "value": "16:9" }
      ]
    }
  ]
}
```

### Generation Response
```json
{
  "transactionId": "uuid-transaction-id",
  "taskId": "task12345",
  "status": "PENDING",
  "message": "Generation request submitted successfully"
}
```

## 🤝 Contributing

This is a standardization layer for AI content generation. When adding new providers:

1. Implement the `BaseAIAdapter` interface
2. Create provider-specific adapter in `/src/adapters`
3. Register adapter in `AdapterFactory`
4. Update database seed with provider models

## 📄 License

MIT

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

AI Providers:
- [KIE.AI](https://kie.ai/)
- [GeminiGen.AI](https://geminigen.ai/)
