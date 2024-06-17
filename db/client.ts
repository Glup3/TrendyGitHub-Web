import { Kysely, PostgresDialect, Selectable } from 'kysely'
import { Pool } from 'pg'

export interface Database {
  repositories: RepositoriesTable
  mv_daily_stars: HistoryView
  mv_weekly_stars: HistoryView
  mv_monthly_stars: HistoryView
}

export interface HistoryView {
  repository_id: number
  stars_difference: number
}

export interface RepositoriesTable {
  id: number
  github_id: string
  name: string
  name_with_owner: string
  star_count: number
  fork_count: number
  primary_language: string
  languages: string[]
  history_missing: boolean
}
export type Repository = Selectable<RepositoriesTable>

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})
