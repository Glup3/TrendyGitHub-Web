import env from '@/lib/env'
import { Kysely, PostgresDialect, Selectable } from 'kysely'
import { Pool } from 'pg'

export interface Database {
  repositories: RepositoriesTable
  stars_history: StarsHistoryTable
  mv_daily_stars: HistoryView
  mv_weekly_stars: HistoryView
  mv_monthly_stars: HistoryView
}

export interface HistoryView {
  repository_id: number
  stars_difference: number
}

export interface StarsHistoryTable {
  id: number
  repository_id: number
  star_count: number
  created_at: Date
  updated_at: Date
}

export interface RepositoriesTable {
  id: number
  github_id: string
  name: string
  name_with_owner: string
  star_count: number
  fork_count: number
  primary_language: string | undefined
  description: string | undefined
  languages: string[]
  history_missing: boolean
}
export type Repository = Selectable<RepositoriesTable>

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: env.DATABASE_URL,
    }),
  }),
})
