# AI Model Standardization Layer

A unified RESTful API layer that standardizes requests, responses, and webhooks from various AI generation providers (KieAI, GeminiGen, etc.) across multiple categories.

## Features

- **Unified API Interface**: Single, consistent API for all AI generation categories
- **Multi-Provider Support**: Currently supports KieAI and GeminiGen, easily extensible
- **Automatic Failover**: Multi-key support per provider with automatic rotation on errors/rate limits
- **Standardized I/O**: Consistent request/response/webhook formats across all providers
- **Smart Mapping**: Adapters map variable names between standard format and provider-specific APIs while preserving values
- **9 Generation Categories**:
  - Text to Image
  - Image to Image
  - Text to Video
  - Image to Video
  - Audio to Video
  - Storyboard to Video
  - Text to Music
  - Speech to Text
  - Text to Speech (Single & Multi-speaker)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Unified REST API                        │
│          (Standardized Request/Response Format)             │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐       ┌────────▼────────┐
│  KieAI Adapter │       │ GeminiGen Adapter│
│  (Field Mapper)│       │  (Field Mapper)  │
└───────┬────────┘       └────────┬────────┘
        │                         │
┌───────▼────────┐       ┌────────▼────────┐
│   KieAI API    │       │  GeminiGen API  │
└────────────────┘       └─────────────────┘
```

## Technology Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (via Prisma ORM)
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- API keys for providers (KieAI, GeminiGen)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
# Edit .env with your database URL and API keys
```

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (if database is accessible)
npm run prisma:migrate

# Seed initial data (providers, models, API keys)
npm run prisma:seed
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

Once running, visit `http://localhost:3000/api` for interactive Swagger documentation.

### Key Endpoints

#### Generation Endpoints (Unified Interface)

- `POST /api/v1/generation/text-to-image` - Generate image from text
- `POST /api/v1/generation/image-to-image` - Generate image from image + text
- `POST /api/v1/generation/text-to-video` - Generate video from text
- `POST /api/v1/generation/image-to-video` - Generate video from image + text
- `POST /api/v1/generation/audio-to-video` - Generate video from audio
- `POST /api/v1/generation/storyboard-to-video` - Generate video from storyboard
- `POST /api/v1/generation/text-to-music` - Generate music from text
- `POST /api/v1/generation/speech-to-text` - Convert speech to text
- `POST /api/v1/generation/text-to-speech` - Convert text to speech (single)
- `POST /api/v1/generation/text-to-speech-multi` - Convert text to speech (multi)
- `GET /api/v1/generation/job/:id` - Get job status

#### Management Endpoints

- `GET/POST/PUT/DELETE /api/v1/providers` - Manage providers
- `GET/POST/PUT/DELETE /api/v1/models` - Manage AI models
- `GET/POST/PUT/DELETE /api/v1/api-keys` - Manage API keys
- `GET /api/v1/jobs` - List jobs with filters
- `POST /api/v1/webhooks/:provider` - Receive provider webhooks

## Example Usage

### Text to Image Generation

```bash
curl -X POST http://localhost:3000/api/v1/generation/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "aiModelId": "model-id-here",
    "prompt": "A serene mountain landscape at sunset",
    "aspectRatio": "16:9",
    "numberOfGenerations": 1
  }'
```

**Response:**
```json
{
  "id": "job-id",
  "status": "PROCESSING",
  "statusPercentage": 50,
  "category": "TEXT_TO_IMAGE",
  "modelName": "Flux Kontext Pro",
  "providerName": "KieAI",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Check Job Status

```bash
curl http://localhost:3000/api/v1/generation/job/job-id
```

**Response (Completed):**
```json
{
  "id": "job-id",
  "status": "COMPLETED",
  "statusPercentage": 100,
  "resultUrl": "https://cdn.example.com/result.jpg",
  "thumbnailUrl": "https://cdn.example.com/thumb.jpg",
  "category": "TEXT_TO_IMAGE",
  "modelName": "Flux Kontext Pro",
  "providerName": "KieAI",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "completedAt": "2025-01-01T00:01:30.000Z"
}
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:pass@host:port/db"
KIEAI_API_KEY="your-kie-api-key"
GEMINIGENAI_API_KEY="your-geminigen-api-key"
PORT=3000
```

## Development

```bash
# Run in watch mode
npm run start:dev

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# View database
npm run prisma:studio
```

## License

UNLICENSED
