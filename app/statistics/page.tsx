import { StatisticsWidget } from '@/components/StatisticsWidget'
import { StarDistributionChart } from '@/components/statistics/StarDistributionChart'
import { db } from '@/db/client'
import { type Timeframe, getPageStats } from '@/lib/umami'
import { getFlag } from '@/lib/unleash'
import { sql } from 'kysely'
import { notFound } from 'next/navigation'

type StarCountDistribution = {
  star_range: string
  count: string
}

const getData = async () => {
  const query1 = await db
    .selectFrom('repositories')
    .select(({ fn }) => [
      fn.countAll<number>('repositories').as('totalRepositories'),
      fn.max<number>('star_count').as('maxStarCount'),
      fn.min<number>('star_count').as('minStarCount'),
      fn.avg('star_count').as('avgStarCount'),
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

  const query3 = await sql<StarCountDistribution>`
    SELECT 
      CASE 
          WHEN star_count BETWEEN 200 AND 999 THEN '200-999'
          WHEN star_count BETWEEN 1000 AND 9999 THEN '1000-9999'
          WHEN star_count BETWEEN 10000 AND 49999 THEN '10000-49999'
          WHEN star_count BETWEEN 50000 AND 99999 THEN '50000-99999'
          ELSE '100000+'
      END AS star_range,
      COUNT(*) AS count
    FROM repositories
    GROUP BY star_range
    ORDER BY count;
  `.execute(db)

  const totalMissingHistoryStarCount = query2[0]?.sumStarCount
  const estimatedHours = (totalMissingHistoryStarCount ?? 0) / 100 / 10_000
  const estimatedDays = estimatedHours / 24

  return {
    totalRepositories: Number(query1[0]?.totalRepositories),
    maxStarCount: query1[0]?.maxStarCount,
    minStarCount: query1[0]?.minStarCount,
    avgStarCount: Number(query1[0]?.avgStarCount),
    totalMissingHistoryRepositories: Number(query2[0]?.totalMissingHistoryRepositories),
    totalMissingHistoryStarCount: Number(totalMissingHistoryStarCount),
    estimatedHours: estimatedHours,
    estimatedDays: estimatedDays,
    starCountDistribution: query3.rows.map((row) => ({ name: row.star_range, count: Number(row.count) })),
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

      <h2 className="text-2xl font-bold my-4">Repository Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatisticsWidget title="Total Repositories" value={statistics.totalRepositories.toLocaleString('en-US')} />
        <StatisticsWidget title="Most Stars" value={statistics.maxStarCount.toLocaleString()} />
        <StatisticsWidget title="Least Stars" value={statistics.minStarCount.toLocaleString()} />
        <StatisticsWidget
          title="Average Stars"
          value={statistics.avgStarCount.toLocaleString('en-US', { maximumFractionDigits: 2 })}
        />

        <div className="h-72 col-span-full border-2 p-3 rounded-2xl">
          <span className="mb-2 block">Star Count Distribution</span>
          <StarDistributionChart data={statistics.starCountDistribution} />
        </div>
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

      <h2 className="text-2xl font-bold my-4">24 Hour Stats</h2>
      <UmamiStatisticsWidgets timeframe="24h" />

      <h2 className="text-2xl font-bold my-4">7 Days Stats</h2>
      <UmamiStatisticsWidgets timeframe="7d" />

      <h2 className="text-2xl font-bold my-4">30 Days Stats</h2>
      <UmamiStatisticsWidgets timeframe="30d" />
    </main>
  )
}

const UmamiStatisticsWidgets = async ({ timeframe }: { timeframe: Timeframe }) => {
  const stats = await getPageStats(timeframe)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatisticsWidget title="Views" value={stats.pageviews.value.toLocaleString()} />
      <StatisticsWidget title="Visits" value={stats.visits.value.toLocaleString()} />
      <StatisticsWidget title="Visitors" value={stats.visitors.value.toLocaleString()} />
      <StatisticsWidget
        title="Average Visit Time"
        value={`${(stats.totaltime.value / stats.pageviews.value).toLocaleString()} sec`}
      />
    </div>
  )
}
