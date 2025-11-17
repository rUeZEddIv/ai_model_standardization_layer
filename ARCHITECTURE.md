# Architecture Documentation

## Overview

The AI Model Standardization Layer is a NestJS-based API that provides a unified interface for multiple AI generation providers. It handles request mapping, response normalization, API key rotation, and webhook processing.

## Core Components

### 1. Provider Adapters

**Location**: `src/providers/adapters/`

Provider adapters are responsible for:
- Mapping standardized requests to provider-specific formats
- Converting provider responses back to standardized format
- Handling provider-specific webhooks
- Managing provider API endpoints

**Key Files**:
- `base.adapter.ts` - Abstract base class for all adapters
- `kie-ai.adapter.ts` - KieAI provider implementation
- `geminigen.adapter.ts` - GeminiGen provider implementation
- `adapter.factory.ts` - Factory for getting appropriate adapter

### 2. Standardized DTOs

**Location**: `src/common/dtos/`

DTOs define the standardized request format for all generation categories:
- Text to Image
- Image to Image
- Text to Video
- Image to Video
- Audio to Video
- Storyboard to Video
- Text to Music
- Speech to Text
- Text to Speech (Single & Multi)

Each DTO includes validation decorators from `class-validator`.

### 3. API Key Management

**Location**: `src/modules/api-keys/`

Features:
- Multiple keys per provider
- Priority-based selection
- Automatic error tracking
- Rate limit detection
- Auto-failover on errors

**Key Methods**:
- `getActiveKey()` - Get next available key (priority + LRU)
- `markKeyAsError()` - Track failed requests
- `markKeyAsRateLimited()` - Handle rate limits
- `resetErrorCount()` - Reset on success

### 4. Job Processing

**Location**: `src/modules/jobs/`

The job service handles:
- Creating generation jobs
- Async processing with retry logic
- Mapping requests/responses via adapters
- Status tracking
- Error handling with fallback

**Job Lifecycle**:
1. PENDING - Job created
2. PROCESSING - Submitted to provider
3. COMPLETED/FAILED - Final state

### 5. Unified Generation API

**Location**: `src/modules/generation/`

Single controller exposing all generation endpoints:
- All endpoints return standardized response format
- Accept standardized request DTOs
- Delegate to JobsService for processing

## Request Flow

```
Client Request
    ↓
Generation Controller (Validates DTO)
    ↓
Jobs Service (Creates Job)
    ↓
API Keys Service (Gets Active Key)
    ↓
Adapter Factory (Gets Provider Adapter)
    ↓
Provider Adapter (Maps Request)
    ↓
HTTP Request to Provider
    ↓
Provider Response
    ↓
Adapter (Maps Response)
    ↓
Jobs Service (Updates Job)
    ↓
Standardized Response to Client
```

## Webhook Flow

```
Provider Webhook
    ↓
Webhooks Controller
    ↓
Webhooks Service (Stores Raw Payload)
    ↓
Finds Associated Job
    ↓
Jobs Service (Updates Job Status)
    ↓
Adapter (Normalizes Webhook Data)
    ↓
Job Updated with Standardized Data
```

## Database Schema

### Tables

1. **providers** - AI service providers (KieAI, GeminiGen)
2. **ai_models** - Specific models with capabilities
3. **api_keys** - Provider API keys with status tracking
4. **jobs** - Generation jobs with request/response data
5. **webhook_events** - Raw webhook payloads and normalized data

### Key Relations

- Provider → AI Models (1:N)
- Provider → API Keys (1:N)
- Provider → Jobs (1:N)
- AI Model → Jobs (1:N)
- API Key → Jobs (1:N)
- Job → Webhook Events (1:N)

## Extensibility

### Adding a New Provider

1. Create adapter class in `src/providers/adapters/`:

```typescript
@Injectable()
export class NewProviderAdapter extends BaseAdapter {
  getProviderName(): string {
    return 'new-provider';
  }

  mapRequest(category: string, req: any): any {
    // Map standard fields to provider fields
  }

  mapResponse(category: string, res: any): any {
    // Map provider response to standard format
  }

  // ... implement other methods
}
```

2. Register in `adapter.factory.ts`
3. Add provider via API or seed script
4. Add models for the provider

### Adding a New Generation Category

1. Create DTO in `src/common/dtos/`
2. Add enum value in Prisma schema
3. Add endpoint in `generation.controller.ts`
4. Implement mapping in relevant adapters

## Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `KIEAI_API_KEY` - KieAI API key (optional, can add via API)
- `GEMINIGENAI_API_KEY` - GeminiGen API key (optional)
- `PORT` - Server port (default: 3000)

### Prisma Configuration

- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Seed: `prisma/seed.ts`

## Best Practices

1. **Always use adapters** - Never call provider APIs directly
2. **Preserve values** - Adapters map field names only, not values
3. **Handle errors** - Use try-catch and proper error logging
4. **Track failures** - API key rotation depends on error tracking
5. **Validate input** - Use DTOs with class-validator decorators
6. **Document changes** - Update Swagger decorators when modifying APIs

## Testing Strategy

1. **Unit Tests** - Test adapters, services independently
2. **Integration Tests** - Test API endpoints with mock providers
3. **E2E Tests** - Test complete flows with real database

## Monitoring & Logging

- NestJS built-in logger used throughout
- Log levels: LOG, WARN, ERROR
- Key events logged:
  - API key failures
  - Job status changes
  - Webhook processing
  - Provider errors

## Security Considerations

1. **API Keys** - Stored in database (consider encryption)
2. **Input Validation** - All DTOs validated
3. **Error Messages** - Don't expose sensitive info
4. **CORS** - Enabled (configure as needed)
5. **Rate Limiting** - Handled per provider
