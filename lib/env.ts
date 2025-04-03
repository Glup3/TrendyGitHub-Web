import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  UNLEASH_SERVER_API_TOKEN: z.string(),
  UNLEASH_SERVER_API_URL: z.string(),
  UMAMI_TOKEN: z.string(),
  UMAMI_WEBSITE_ID: z.string(),
  UMAMI_URL: z.string(),
  REDIS_URL: z.string(),
  DB_POOL_MAX: z.string().optional(),
  DB_POOL_MIN: z.string().optional(),
  DB_CONNECTION_TIMEOUT: z.string().optional(),
  DB_IDLE_TIMEOUT: z.string().optional(),
  DB_ALLOW_EXIT_ON_IDLE: z.string().optional(),
})

const env = envSchema.parse(process.env)

export default env
