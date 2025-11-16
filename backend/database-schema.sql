-- AI Model Standardization Layer - Database Schema
-- PostgreSQL Setup Script

-- Create database (run this first if needed)
-- CREATE DATABASE ai_gateway;

-- Connect to the database
-- \c ai_gateway;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Providers table
CREATE TABLE IF NOT EXISTS ai_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    docs_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Provider Credentials table
CREATE TABLE IF NOT EXISTS user_provider_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
    api_key VARCHAR(500) NOT NULL,
    nickname VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, provider_id)
);

-- AI Models table
CREATE TABLE IF NOT EXISTS ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES ai_providers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    model_identifier VARCHAR(255) NOT NULL,
    generation_category VARCHAR(50) NOT NULL,
    api_endpoint_url VARCHAR(500) NOT NULL,
    webhook_callback_url VARCHAR(500),
    capabilities JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generation Jobs table
CREATE TABLE IF NOT EXISTS generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id UUID NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    input_payload JSONB NOT NULL,
    output_payload JSONB,
    provider_job_id VARCHAR(255),
    error_message TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated Outputs table
CREATE TABLE IF NOT EXISTS generated_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES generation_jobs(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    url VARCHAR(1000),
    text_content TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_provider_credentials_user_id ON user_provider_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_provider_credentials_provider_id ON user_provider_credentials(provider_id);
CREATE INDEX IF NOT EXISTS idx_ai_models_provider_id ON ai_models(provider_id);
CREATE INDEX IF NOT EXISTS idx_ai_models_generation_category ON ai_models(generation_category);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_model_id ON generation_jobs(model_id);
CREATE INDEX IF NOT EXISTS idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_generated_outputs_job_id ON generated_outputs(job_id);

-- Sample data insertion (optional)

-- Insert sample providers
INSERT INTO ai_providers (name, docs_url) VALUES
    ('Kie.ai', 'https://docs.kie.ai'),
    ('Geminigen.ai', 'https://docs.geminigen.ai')
ON CONFLICT (name) DO NOTHING;

-- Insert sample user (password: demo123 - bcrypt hashed)
INSERT INTO users (email, password_hash) VALUES
    ('demo@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz123456')
ON CONFLICT (email) DO NOTHING;

-- Insert sample AI models (requires provider IDs)
INSERT INTO ai_models (
    provider_id,
    name,
    model_identifier,
    generation_category,
    api_endpoint_url,
    webhook_callback_url,
    capabilities,
    is_active
)
SELECT
    p.id,
    'Kie Image Gen v2',
    'kie-img-v2-sdxl',
    'TEXT_TO_IMAGE',
    'https://api.kie.ai/v1/generate/image',
    'https://api.kie.ai/v1/webhooks',
    '{
        "aspectRatios": ["1:1", "16:9", "4:3", "3:4", "9:16"],
        "resolutions": ["1024x1024", "1920x1080", "1080x1920", "800x600"],
        "maxGenerations": 4,
        "supportedFeatures": ["seed", "numberOfGenerations"]
    }'::jsonb,
    true
FROM ai_providers p
WHERE p.name = 'Kie.ai'
ON CONFLICT DO NOTHING;

INSERT INTO ai_models (
    provider_id,
    name,
    model_identifier,
    generation_category,
    api_endpoint_url,
    webhook_callback_url,
    capabilities,
    is_active
)
SELECT
    p.id,
    'Geminigen SDXL',
    'geminigen-sdxl-v1',
    'TEXT_TO_IMAGE',
    'https://api.geminigen.ai/v1/image/generate',
    'https://api.geminigen.ai/v1/callback',
    '{
        "aspectRatios": ["1:1", "16:9", "4:3"],
        "resolutions": ["512x512", "1024x1024", "1920x1080"],
        "maxGenerations": 8,
        "supportedFeatures": ["seed", "numberOfGenerations", "negativePrompt"]
    }'::jsonb,
    true
FROM ai_providers p
WHERE p.name = 'Geminigen.ai'
ON CONFLICT DO NOTHING;

-- Verification queries
SELECT 'Database setup complete!' as message;
SELECT COUNT(*) as provider_count FROM ai_providers;
SELECT COUNT(*) as model_count FROM ai_models;
SELECT COUNT(*) as user_count FROM users;
