import { SimplePagination } from '@/components/SimplePagination'
import { SidebarFilter } from '@/components/trending/SidebarFilter'
import { TrendingTiles, TrendingTilesSkeleton } from '@/components/trending/TrendingTiles'
import { getTotalStarsRankingQuery } from '@/db/queries'
import { searchSchema, type viewSchema } from '@/lib/schemas'
import { Suspense } from 'react'
import { type z } from 'zod'

const PAGE_SIZE = 50

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function Home({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)
  const table = viewToTable(search.view)
  const totalCount = await getTotalStarsRankingQuery(table, search.language)

  return (
    <div className="container flex">
      <main className="flex-1">
        <h1 className="mb-4 text-2xl font-bold">Trending GitHub Repositories</h1>

        <Suspense fallback={<TrendingTilesSkeleton />}>
          <TrendingTiles page={search.page} pageSize={PAGE_SIZE} language={search.language} view={search.view} />
        </Suspense>

        <SimplePagination
          className="my-4"
          currentPage={search.page}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          getPageHref={(newPage) => ({ pathname: '/', query: { ...search, page: newPage } })}
        />
      </main>

      <SidebarFilter search={search} />
    </div>
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
