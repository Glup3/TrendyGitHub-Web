import { db } from './client'
import { sql } from 'kysely'

export type HistoryTable = 'mv_daily_stars' | 'mv_weekly_stars' | 'mv_monthly_stars'

export const getStarsRankingQuery = (vars: {
  table: HistoryTable
  perPage: number
  offset: number
  language: string | undefined
}) => {
  let query = db
    .selectFrom(`${vars.table} as mv_stars_history`)
    .innerJoin('repositories', 'repositories.id', 'mv_stars_history.repository_id')
    .select([
      'id',
      'github_id',
      'name_with_owner',
      'star_count',
      'fork_count',
      'primary_language',
      'description',
      'stars_difference',
    ])
    .orderBy('stars_difference', 'desc')
    .orderBy('repository_id')
    .limit(vars.perPage)
    .offset(vars.offset)

  if (vars.language) {
    query = query.where('primary_language', 'ilike', vars.language)
  }

  return query
}

export const getTotalStarsRankingQuery = (table: HistoryTable) => {
  return db.selectFrom(`${table} as mv_stars_history`).select(({ fn }) => [fn.countAll<number>().as('total')])
}

export const getMonthlyStarHistories = (repoIds: number[]) => {
  return db
    .selectFrom('stars_history')
    .select(['repository_id', 'star_count', 'created_at'])
    .where('created_at', '>=', sql<Date>`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - INTERVAL '1 month'`)
    .where('repository_id', 'in', repoIds)
    .orderBy('created_at asc')
}

export const getLanguages = () => {
  return db
    .selectFrom('repositories')
    .select(({ fn }) => ['primary_language', fn.count<number>('primary_language').as('count')])
    .groupBy('primary_language')
    .orderBy('count desc')
}
