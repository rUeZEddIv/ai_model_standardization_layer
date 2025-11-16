# AI Model Standardization Layer

A comprehensive API Gateway built with NestJS and PostgreSQL that provides a unified, standardized interface for interacting with multiple AI providers (Kie.ai, Geminigen.ai, OpenAI, etc.) for various generative AI tasks.

## 🎯 Overview

This project solves the problem of dealing with different AI provider APIs by creating a single abstraction layer that:

- **Standardizes** all requests and responses across different AI providers
- **Dynamically exposes** each model's unique capabilities (resolutions, aspect ratios, voices, etc.)
- **Handles** both synchronous and asynchronous (webhook-based) generation workflows
- **Manages** user credentials for multiple providers
- **Tracks** all generation jobs in a PostgreSQL database

## 🏗️ Architecture

The system implements the **Adapter/Strategy Pattern**:

```
Frontend/Client
    ↓
NestJS API Gateway (Standardized Interface)
    ↓
Adapter Layer (Provider-specific translation)
    ↓
AI Providers (Kie.ai, Geminigen.ai, etc.)
    ↓
Webhook Callbacks
    ↓
NestJS Webhook Handler
    ↓
Database Update
```

### Flow Example: Text-to-Image Generation

1. **Client** sends standardized JSON to `POST /api/v1/generate/text-to-image`
2. **Gateway** identifies the AI model and loads the appropriate adapter
3. **Adapter** translates the standard format to provider-specific format
4. **Provider API** receives request and returns job ID
5. **Gateway** saves job to database with `PENDING` status
6. **Provider** processes the request asynchronously
7. **Provider** sends callback to `POST /api/v1/webhooks/provider-callback/:jobId`
8. **Webhook Handler** updates job status to `COMPLETED` and saves outputs

## 📦 Features

### Core Capabilities

- ✅ **10 Generation Categories** supported:
  1. Text-to-Image
  2. Image-to-Image
  3. Text-to-Video
  4. Image-to-Video
  5. Audio-to-Video
  6. Storyboard-to-Video
  7. Text-to-Music
  8. Speech-to-Text
  9. Text-to-Speech (Single Speaker)
  10. Text-to-Speech (Multiple Speakers)

- ✅ **Dynamic Capability Discovery**: Frontend queries model capabilities to populate form options
- ✅ **Multi-Provider Support**: Easily add new AI providers via adapter pattern
- ✅ **Credential Management**: Users can configure their own API keys per provider
- ✅ **Job Tracking**: Complete audit trail of all generation requests
- ✅ **Webhook Support**: Async job processing with provider callbacks
- ✅ **Swagger Documentation**: Auto-generated, interactive API docs

### Database Schema

The PostgreSQL database includes:

- **users** - User accounts
- **ai_providers** - Provider registry (Kie.ai, Geminigen.ai, etc.)
- **ai_models** - Individual models with JSONB capabilities
- **user_provider_credentials** - User API keys for each provider
- **generation_jobs** - Job queue and status tracking
- **generated_outputs** - Generated content (images, videos, audio, text)

## 🚀 Quick Start

### Prerequisites

- Node.js v20+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/rUeZEddIv/ai_model_standardization_layer.git
cd ai_model_standardization_layer

# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Create database
createdb ai_gateway

# Start the application
npm run start:dev
```

The API will be available at: `http://localhost:3000`

Swagger docs at: `http://localhost:3000/api/docs`

## 📚 Documentation

### API Endpoints

#### Model Discovery
- `GET /api/v1/models?category=TEXT_TO_IMAGE` - List models for a category
- `GET /api/v1/models/:id/capabilities` - Get model-specific capabilities

#### Generation
- `POST /api/v1/generate/text-to-image` - Generate image from text
- `GET /api/v1/generate/jobs/:jobId` - Check job status

#### Webhooks
- `POST /api/v1/webhooks/provider-callback/:jobId` - Receive provider callbacks

### Example: Dynamic Form Population

```javascript
// 1. User selects "Text to Image" category
const models = await fetch('/api/v1/models?category=TEXT_TO_IMAGE');
// Returns: [{ id: "uuid-1", name: "Kie Image Gen" }, ...]

// 2. User selects a model
const capabilities = await fetch('/api/v1/models/uuid-1/capabilities');
// Returns: {
//   aspectRatios: ["1:1", "16:9", "4:3"],
//   resolutions: ["1024x1024", "1920x1080"],
//   maxGenerations: 4
// }

// 3. Frontend dynamically populates form with these options
```

### Example: Generate Image

```bash
curl -X POST http://localhost:3000/api/v1/generate/text-to-image \
  -H "Content-Type: application/json" \
  -H "x-user-id: <user-uuid>" \
  -d '{
    "aiModelId": "<model-uuid>",
    "prompt": "A serene mountain landscape at sunset",
    "aspectRatio": "16:9",
    "resolution": "1920x1080",
    "numberOfGenerations": 2,
    "isPublic": false
  }'
```

Response:
```json
{
  "jobId": "job-uuid",
  "status": "PENDING",
  "providerJobId": "kie-1234567890",
  "message": "Job submitted to Kie.ai, awaiting callback"
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── adapters/        # Provider-specific adapters (Kie, Geminigen)
│   ├── controllers/     # HTTP request handlers
│   ├── dto/            # Data Transfer Objects with validation
│   ├── entities/       # TypeORM database entities
│   ├── enums/          # TypeScript enumerations
│   ├── interfaces/     # Strategy interfaces
│   ├── services/       # Business logic
│   ├── app.module.ts   # Main application module
│   └── main.ts         # Application entry point
├── scripts/            # Seed data and utilities
└── test/              # E2E tests
```

## 🔧 Adding a New Provider

To add support for a new AI provider:

1. Create a new adapter in `src/adapters/`:
```typescript
@Injectable()
export class NewProviderAdapter implements ITextToImageStrategy {
  async generate(dto: TextToImageDto, apiKey: string): Promise<GenerationResult> {
    // Transform to provider format
    // Call provider API
    // Transform response to standard format
  }
}
```

2. Register in `TextToImageService`:
```typescript
this.adapters.set('NewProvider.ai', this.newProviderAdapter);
```

3. Add provider and models to database with capabilities

## 📝 Sample Data

See `scripts/seed-data.ts` for example provider and model configurations, including:
- Kie.ai models (Image Gen, Sora 2 Pro, Image Editor)
- Geminigen.ai models (SDXL, TTS Pro)
- Complete capability definitions for each model

## 🔒 Security Notes

- API keys are stored in database (should be encrypted in production)
- User authentication should be implemented (currently uses `x-user-id` header)
- CORS is enabled for development
- Input validation via class-validator
- Consider rate limiting for production

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions and support, please open an issue in the GitHub repository.
