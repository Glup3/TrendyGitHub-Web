import { SimplePagination } from '@/components/SimplePagination'
import { TopTrendingWidgets } from '@/components/TopTrendingWidgets'
import { TrendingFilter } from '@/components/TrendingFilter'
import { TrendingTiles } from '@/components/trending/TrendingTiles'
import { type HistoryTable, getLanguages, getTotalStarsRankingQuery } from '@/db/queries'
import { searchSchema, type viewSchema } from '@/lib/schemas'
import { Suspense } from 'react'
import { type z } from 'zod'

const perPage = 50

// 1-based index
async function getData(table: HistoryTable) {
  const queryTotal = getTotalStarsRankingQuery(table)
  const queryLanguages = getLanguages()

  const [total, languages] = await Promise.all([queryTotal.execute(), queryLanguages.execute()])

  return {
    totalCount: total[0]?.total ?? 0,
    languages: languages,
  }
}

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function Home({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)
  const table = viewToTable(search.view)

  const res = await getData(table)

  return (
    <main className="container">
      <h1 className="text-3xl font-bold">Trending GitHub Repositories</h1>

      <div className="my-4 flex flex-col justify-between sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Top Trending</h2>

        <TrendingFilter
          language={search.language}
          languages={res.languages.map((l) => ({ name: l.primary_language }))}
        />
      </div>

      <TopTrendingWidgets table={table} language={search.language} />

      <h2 className="mb-4 mt-8 text-2xl font-bold">Trending {viewToTitle(search.view)}</h2>

      <Suspense fallback={<div>Loading...</div>}>
        <TrendingTiles page={search.page} language={search.language} view={search.view} />
      </Suspense>

      <SimplePagination
        className="my-4"
        currentPage={search.page}
        totalCount={res.totalCount}
        perPage={perPage}
        getPageHref={(newPage) => ({ pathname: '/', query: { ...search, page: newPage } })}
      />
    </main>
  )
}

function viewToTable(view: z.infer<typeof viewSchema>) {
  switch (view) {
    case 'daily':
      return 'mv_daily_stars'
    case 'weekly':
      return 'mv_weekly_stars'
    case 'monthly':
      return 'mv_monthly_stars'
    default:
      return 'mv_daily_stars'
  }
}

function viewToTitle(view: z.infer<typeof viewSchema>) {
  switch (view) {
    case 'daily':
      return 'Daily'
    case 'weekly':
      return 'Weekly'
    case 'monthly':
      return 'Monthly'
    default:
      return 'Daily'
  }
}
