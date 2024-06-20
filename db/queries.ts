import { db } from './client'

type HistoryTable = 'mv_daily_stars' | 'mv_weekly_stars' | 'mv_monthly_stars'

export const getStarsRankingQuery = (vars: { table: HistoryTable; perPage: number; offset: number }) => {
  return db
    .selectFrom(`${vars.table} as mv_stars_history`)
    .innerJoin('repositories', 'repositories.id', 'mv_stars_history.repository_id')
    .select([
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
}

export const getTotalStarsRankingQuery = (table: HistoryTable) => {
  return db.selectFrom(`${table} as mv_stars_history`).select(({ fn }) => [fn.countAll<number>().as('total')])
}
