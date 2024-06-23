import { db } from '@/db/client'

const getData = async () => {
  const query1 = await db
    .selectFrom('repositories')
    .select(({ fn }) => [
      fn.countAll<number>('repositories').as('totalRepositories'),
      fn.max('star_count').as('maxStarCount'),
      fn.min('star_count').as('minStarCount'),
    ])
    .execute()

  const query2 = await db
    .selectFrom('repositories')
    .select(({ fn }) => [
      fn.countAll<number>('repositories').as('totalMissingHistoryRepositories'),
      fn.sum<number>('star_count').as('sumStarCount'),
    ])
    .where('history_missing', '=', true)
    .execute()

  const totalMissingHistoryStarCount = query2[0]?.sumStarCount
  const estimatedHours = (totalMissingHistoryStarCount ?? 0) / 100 / 10_000
  const estimatedDays = estimatedHours / 24

  return {
    totalRepositories: query1[0]?.totalRepositories,
    maxStarCount: query1[0]?.maxStarCount,
    minStarCount: query1[0]?.minStarCount,
    totalMissingHistoryRepositories: query2[0]?.totalMissingHistoryRepositories,
    totalMissingHistoryStarCount: totalMissingHistoryStarCount,
    estimatedHours: estimatedHours,
    estimatedDays: estimatedDays,
  }
}

export default async function StatisticsPage() {
  const statistics = await getData()

  return (
    <main className="container mx-auto">
      <div>{statistics.totalRepositories} Repositories</div>
      <div>{statistics.maxStarCount} Max Stars</div>
      <div>{statistics.minStarCount} Min Stars</div>
      <div>{statistics.totalMissingHistoryRepositories} Missing Repositories</div>
      <div>{statistics.totalMissingHistoryStarCount} Sum Missing Stars</div>
      <div>~ {Math.ceil(statistics.estimatedHours)} hours left</div>
      <div>~ {Math.ceil(statistics.estimatedDays)} days left</div>
    </main>
  )
}
