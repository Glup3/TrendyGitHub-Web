import { z } from 'zod'

export const DEFAULT_LANGUAGE = 'All'

export const pageSchema = z.coerce.number().int().positive().catch(1)
export const viewSchema = z.enum(['daily', 'weekly', 'monthly']).catch('daily')
export const searchSchema = z.object({
  page: pageSchema,
  view: viewSchema,
  language: z.string().catch(DEFAULT_LANGUAGE),
})
