import { db } from './client'
import { DEFAULT_LANGUAGE } from '@/lib/schemas'
import { sql } from 'kysely'
import { cache } from 'react'

export type HistoryTable = 'mv_daily_stars' | 'mv_weekly_stars' | 'mv_monthly_stars'

export const getStarsRankingQuery = (vars: {
  table: HistoryTable
  perPage: number
  offset: number
  language: string
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
      'repositories.description',
      'stars_difference',
    ])
    .orderBy('stars_difference', 'desc')
    .orderBy('repository_id')
    .limit(vars.perPage)
    .offset(vars.offset)

  if (vars.language !== DEFAULT_LANGUAGE) {
    query = query.where('primary_language', '=', vars.language)
  }

  return query
}

export const getTotalStarsRankingQuery = async (table: HistoryTable, language: string) => {
  let query = db
    .selectFrom(`${table} as mv_stars_history`)
    .innerJoin('repositories', 'repositories.id', 'mv_stars_history.repository_id')
    .select(({ fn }) => [fn.countAll<number>().as('total')])

  if (language !== DEFAULT_LANGUAGE) {
    query = query.where('primary_language', '=', language)
  }

  return (await query.executeTakeFirst())?.total ?? 0
}

export const getMonthlyStarHistories = (repoIds: number[]) => {
  return db
    .selectFrom('stars_history_hyper')
    .select(['repository_id', 'star_count', 'date'])
    .where('date', '>=', sql<Date>`(CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - INTERVAL '1 month'`)
    .where('repository_id', 'in', repoIds)
    .orderBy('date asc')
}

export const getAllLanguages = cache(async () => {
  return db.selectFrom('languages').select(['id', 'hexcolor']).orderBy('id').execute()
})
