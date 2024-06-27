import { z } from 'zod'

export const pageSchema = z.coerce.number().int().positive().catch(1)
export const viewSchema = z.enum(['daily', 'weekly', 'monthly']).catch('daily')
export const searchSchema = z.object({
  page: pageSchema,
  view: viewSchema.catch('daily'),
})
