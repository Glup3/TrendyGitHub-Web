import { StatisticsWidget } from '@/components/StatisticsWidget'
import { db } from '@/db/client'
import { getFlag } from '@/lib/unleash'
import { notFound } from 'next/navigation'

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
  const isEnabled = await getFlag('tgh-enable-statistics')

  if (!isEnabled) {
    notFound()
  }

  const statistics = await getData()

  return (
    <main className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Statistics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatisticsWidget title="Total Repositories" value={statistics.totalRepositories.toLocaleString()} />
        <StatisticsWidget title="Most Stars" value={statistics.maxStarCount.toLocaleString()} />
        <StatisticsWidget title="Least Stars" value={statistics.minStarCount.toLocaleString()} />
      </div>

      <h2 className="text-2xl font-bold my-4">Missing Star History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatisticsWidget title="Missing Stars" value={statistics.totalMissingHistoryStarCount.toLocaleString()} />
        <StatisticsWidget
          title="Missing Histories"
          value={statistics.totalMissingHistoryRepositories.toLocaleString()}
        />
        <StatisticsWidget title="Estimated Loading" value={`~ ${Math.ceil(statistics.estimatedHours)} hours`} />
        <StatisticsWidget title="Estimated Loading" value={`~ ${Math.ceil(statistics.estimatedDays)} days`} />
      </div>
    </main>
  )
}
