import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  UNLEASH_SERVER_API_TOKEN: z.string(),
  UNLEASH_SERVER_API_URL: z.string(),
  UMAMI_TOKEN: z.string(),
  UMAMI_WEBSITE_ID: z.string(),
  UMAMI_URL: z.string(),
  REDIS_URL: z.string(),
})

const env = envSchema.parse(process.env)

export default env
