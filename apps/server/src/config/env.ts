import 'dotenv/config'

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  database: {
    path: process.env.DATABASE_PATH || './financial.db'
  },
  
  cache: {
    defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '300000'),
    categoryTTL: parseInt(process.env.CACHE_CATEGORY_TTL || '600000'),
    investmentTTL: parseInt(process.env.CACHE_INVESTMENT_TTL || '900000'),
    transactionTTL: parseInt(process.env.CACHE_TRANSACTION_TTL || '120000'),
    reportTTL: parseInt(process.env.CACHE_REPORT_TTL || '1800000')
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001']
  },
  
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000')
  }
}