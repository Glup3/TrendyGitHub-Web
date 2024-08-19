import env from '@/lib/env'
import { Kysely, PostgresDialect, type Selectable } from 'kysely'
import { Pool } from 'pg'

export interface Database {
  repositories: RepositoriesTable
  stars_history_hyper: StarsHistoryTable
  languages: LanguagesTable
  trend_daily: TrendView
  trend_weekly: TrendView
  trend_monthly: TrendView
}

export interface LanguagesTable {
  id: string
  hexcolor: string
}

export interface TrendView {
  repository_id: number
  first: number
  last: number
  stars_diff: number
}

export interface StarsHistoryTable {
  id: number
  repository_id: number
  star_count: number
  date: Date
}

export interface RepositoriesTable {
  id: number
  github_id: string
  name: string
  name_with_owner: string
  star_count: number
  fork_count: number
  primary_language: string
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
