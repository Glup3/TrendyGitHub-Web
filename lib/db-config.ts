import { z } from 'zod'
import env from './env'

const dbConfigSchema = z.object({
  max: z.number().min(1).max(100).default(20),
  min: z.number().min(1).max(20).default(2),
  connectionTimeoutMillis: z.number().min(1000).max(10000).default(2000),
  idleTimeoutMillis: z.number().min(10000).max(300000).default(30000),
  allowExitOnIdle: z.boolean().default(true),
})

export const dbConfig = dbConfigSchema.parse({
  max: Number(env.DB_POOL_MAX) || 20,
  min: Number(env.DB_POOL_MIN) || 2,
  connectionTimeoutMillis: Number(env.DB_CONNECTION_TIMEOUT) || 2000,
  idleTimeoutMillis: Number(env.DB_IDLE_TIMEOUT) || 30000,
  allowExitOnIdle: env.DB_ALLOW_EXIT_ON_IDLE !== 'false',
}) 