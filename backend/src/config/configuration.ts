export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.API_PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api/v1',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },
  webhook: {
    secret: process.env.WEBHOOK_SECRET || 'webhook-secret',
  },
  providers: {
    kie: {
      baseUrl: process.env.KIE_API_BASE_URL || 'https://api.kie.ai',
      apiKeys: process.env.KIE_API_KEYS
        ? process.env.KIE_API_KEYS.split(',').filter(Boolean)
        : [],
    },
    geminigen: {
      baseUrl:
        process.env.GEMINIGEN_API_BASE_URL || 'https://api.geminigen.ai',
      apiKeys: process.env.GEMINIGEN_API_KEYS
        ? process.env.GEMINIGEN_API_KEYS.split(',').filter(Boolean)
        : [],
    },
  },
  fileStorage: {
    type: process.env.FILE_STORAGE_TYPE || 'local',
    path: process.env.FILE_STORAGE_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
    limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
});
