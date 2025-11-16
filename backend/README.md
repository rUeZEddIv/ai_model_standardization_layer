# AI Content Generation Platform - Backend API

A NestJS-based backend API that integrates multiple AI providers (KIE.AI and GeminiGen.AI) for unified content generation across 11 categories.

## Features

- 🎨 **Text to Image**: Generate images from text descriptions
- 🖼️ **Image to Image**: Transform or edit existing images
- 🎬 **Text to Video**: Generate videos from text descriptions
- 📹 **Image to Video**: Create videos from static images
- 🎵 **Text to Music**: Generate music from descriptions
- 🗣️ **Text to Speech**: Convert text to natural speech
- 🎙️ **Speech to Text**: Transcribe audio to text
- 📚 **Document to Speech**: Convert documents to audio

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator, class-transformer
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis (for queue system - optional)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Seed the database with initial data:
```bash
npm run prisma:seed
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The API will be available at:
- API: `http://localhost:3000/api/v1`
- Swagger Documentation: `http://localhost:3000/api/docs`

## API Endpoints

### Generations
- `POST /api/v1/generations` - Create a new generation task
- `GET /api/v1/generations/:taskId` - Get task status

### Forms
- `GET /api/v1/forms/categories` - List all form categories
- `GET /api/v1/forms/models` - List all AI models
- `GET /api/v1/forms/:categoryId/schema` - Get form schema for a category

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `API_PORT` | Application port | 3000 |
| `API_PREFIX` | API route prefix | api/v1 |
| `KIE_API_BASE_URL` | KIE.AI base URL | https://api.kie.ai |
| `KIE_API_KEYS` | Comma-separated API keys | - |
| `GEMINIGEN_API_BASE_URL` | GeminiGen.AI base URL | https://api.geminigen.ai |
| `GEMINIGEN_API_KEYS` | Comma-separated API keys | - |

## Database Schema

The application uses the following main tables:
- `ai_providers` - AI service providers
- `ai_models` - AI models from providers
- `form_categories` - Generation categories
- `model_field_mappings` - Dynamic form fields
- `generation_tasks` - Generation requests
- `generation_results` - Generated content
- `api_keys` - Provider API keys
- `webhook_logs` - Webhook event logs

## Project Structure

```
backend/
├── src/
│   ├── common/          # Shared DTOs and utilities
│   ├── config/          # Configuration files
│   ├── forms/           # Form schema endpoints
│   ├── generations/     # Generation task management
│   ├── prisma/          # Prisma service
│   └── providers/       # AI provider adapters
│       ├── adapters/    # KIE.AI and GeminiGen adapters
│       └── interfaces/  # Provider interfaces
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed/            # Seed data
└── test/                # Tests
```

## API Usage Examples

### Create Generation Task
```bash
curl -X POST http://localhost:3000/api/v1/generations \
  -H "Content-Type: application/json" \
  -d '{
    "category": "text-to-image",
    "aiModelId": "uuid-of-model",
    "input": {
      "prompt": "A beautiful sunset over mountains",
      "aspectRatio": "16:9",
      "numberOfGenerations": 1,
      "isPublic": false
    }
  }'
```

### Get Task Status
```bash
curl http://localhost:3000/api/v1/generations/{taskId}
```

## License

UNLICENSED
