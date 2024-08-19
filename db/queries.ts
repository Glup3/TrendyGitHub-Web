import { db } from './client'
import { DEFAULT_LANGUAGE } from '@/lib/schemas'
import { sql } from 'kysely'
import { cache } from 'react'

export type TrendView = 'trend_daily' | 'trend_weekly' | 'trend_monthly'

export const getStarsRankingQuery = (vars: { table: TrendView; perPage: number; offset: number; language: string }) => {
  let query = db
    .selectFrom(`${vars.table} as trend_view`)
    .innerJoin('repositories', 'repositories.id', 'trend_view.repository_id')
    .select([
      'id',
      'github_id',
      'name_with_owner',
      'star_count',
      'fork_count',
      'primary_language',
      'repositories.description',
      'stars_diff',
    ])
    .orderBy('stars_diff', 'desc')
    .orderBy('repository_id')
    .limit(vars.perPage)
    .offset(vars.offset)

  if (vars.language !== DEFAULT_LANGUAGE) {
    query = query.where('primary_language', '=', vars.language)
  }

  return query
}

export const getTotalStarsRankingQuery = async (table: TrendView, language: string) => {
  let query = db
    .selectFrom(`${table} as trend_view`)
    .innerJoin('repositories', 'repositories.id', 'trend_view.repository_id')
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
