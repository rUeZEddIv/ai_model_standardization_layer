# AI Model Standardization Layer - Backend

A NestJS-based API Gateway that provides a unified interface for interacting with multiple AI providers (Kie.ai, Geminigen.ai, etc.) for generative AI tasks.

## Features

- **Multi-Provider Support**: Adapter pattern for seamless integration with different AI providers
- **10 Generation Categories**: Support for text-to-image, image-to-image, text-to-video, and more
- **Dynamic Capabilities**: Each AI model exposes its unique capabilities (resolutions, aspect ratios, voices, etc.)
- **Standardized API**: Consistent request/response format regardless of underlying provider
- **Webhook Support**: Asynchronous job processing with webhook callbacks
- **PostgreSQL Database**: TypeORM for data persistence
- **Swagger Documentation**: Auto-generated API documentation

## Architecture

The system follows the **Adapter/Strategy Pattern**:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Business logic and orchestration
3. **Adapters**: Provider-specific implementations that translate between standard format and provider format
4. **Entities**: TypeORM entities for database models
5. **DTOs**: Data validation and transformation

## Database Schema

- **users**: User accounts
- **ai_providers**: AI provider registry (Kie.ai, Geminigen.ai, etc.)
- **ai_models**: Individual AI models with capabilities (JSONB)
- **user_provider_credentials**: User API keys for each provider
- **generation_jobs**: Job tracking with status
- **generated_outputs**: Generated content (images, videos, audio, text)

## Setup

### Prerequisites

- Node.js v20+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
```

### Database Setup

```bash
# Create database
createdb ai_gateway

# Run migrations (auto-sync enabled in development)
npm run start:dev
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

Swagger documentation at `http://localhost:3000/api/docs`

## API Endpoints

### Model Discovery

- `GET /api/v1/models?category=TEXT_TO_IMAGE` - List models by category
- `GET /api/v1/models/:id/capabilities` - Get model capabilities

### Generation

- `POST /api/v1/generate/text-to-image` - Generate image from text
- `GET /api/v1/generate/jobs/:jobId` - Get job status

### Webhooks

- `POST /api/v1/webhooks/provider-callback/:jobId` - Receive provider callbacks

## Example Request

### Text-to-Image Generation

```bash
curl -X POST http://localhost:3000/api/v1/generate/text-to-image \
  -H "Content-Type: application/json" \
  -H "x-user-id: <your-user-id>" \
  -d '{
    "aiModelId": "<model-uuid>",
    "prompt": "A beautiful sunset over mountains",
    "aspectRatio": "16:9",
    "resolution": "1920x1080",
    "numberOfGenerations": 2,
    "isPublic": false
  }'
```

### Response

```json
{
  "jobId": "uuid",
  "status": "PENDING",
  "providerJobId": "kie-1234567890",
  "message": "Job submitted to Kie.ai, awaiting callback"
}
```

## Supported Generation Categories

1. TEXT_TO_IMAGE
2. IMAGE_TO_IMAGE
3. TEXT_TO_VIDEO
4. IMAGE_TO_VIDEO
5. AUDIO_TO_VIDEO
6. STORYBOARD_TO_VIDEO
7. TEXT_TO_MUSIC
8. SPEECH_TO_TEXT
9. TEXT_TO_SPEECH_SINGLE
10. TEXT_TO_SPEECH_MULTIPLE

## Development

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting

```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── adapters/          # Provider-specific adapters
├── controllers/       # HTTP controllers
├── dto/              # Data Transfer Objects
├── entities/         # TypeORM entities
├── enums/            # Enumerations
├── interfaces/       # TypeScript interfaces
├── services/         # Business logic
├── app.module.ts     # Main application module
└── main.ts           # Application entry point
```

## License

MIT
