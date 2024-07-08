import { SimplePagination } from '@/components/SimplePagination'
import { TimeFilter } from '@/components/TimeFilter'
import { LanguageFilter } from '@/components/trending/LanguageFilter'
import { TrendingTiles, TrendingTilesSkeleton } from '@/components/trending/TrendingTiles'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getTotalStarsRankingQuery } from '@/db/queries'
import { searchSchema, type viewSchema } from '@/lib/schemas'
import { SlidersHorizontal } from 'lucide-react'
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Trending GitHub Repositories</h2>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex gap-2 sm:hidden">
                <SlidersHorizontal className="size-4" /> Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div>
                <TimeFilter search={search} className="mb-8" />
                <LanguageFilter search={search} withDropDown={false} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

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

      <aside className="sticky top-10 ml-10 mt-12 hidden h-screen w-[200px] overflow-y-auto px-1 sm:block">
        <TimeFilter search={search} className="mb-8" />
        <LanguageFilter search={search} withDropDown={true} />
      </aside>
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
