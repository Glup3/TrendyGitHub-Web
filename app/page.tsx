import { SimplePagination } from '@/components/SimplePagination'
import { SimpleStarHistoryChart } from '@/components/SimpleStarHistoryChart'
import { TopTrendingWidgets } from '@/components/TopTrendingWidgets'
import { TrendingFilter } from '@/components/TrendingFilter'
import NumberTicker from '@/components/magicui/NumberTicker'
import { HistoryTable, getMonthlyStarHistories, getStarsRankingQuery, getTotalStarsRankingQuery } from '@/db/queries'
import { pageSchema, searchSchema, viewSchema } from '@/lib/schemas'
import { GitFork, Star, Triangle } from 'lucide-react'
import Image from 'next/image'
import { z } from 'zod'

const perPage = 50

// 1-based index
async function getData(page: number, table: HistoryTable) {
  const offset = Math.round(pageSchema.parse(page) - 1) * perPage

  const query = getStarsRankingQuery({ table, perPage, offset })
  const queryTotal = getTotalStarsRankingQuery(table)

  const [res, total] = await Promise.all([query.execute(), queryTotal.execute()])

  return {
    repositories: res,
    totalCount: total[0]?.total ?? 0,
  }
}

async function getHistories(repoIds: number[]) {
  const histories = await getMonthlyStarHistories(repoIds).execute()
  const repoMap = new Map<number, { date: Date; starCount: number }[]>()

  for (const starHistory of histories) {
    const id = starHistory.repository_id
    if (!repoMap.has(id)) {
      repoMap.set(id, [])
    }

    const repoHistory = repoMap.get(id)
    if (repoHistory) {
      repoHistory.push({ date: starHistory.created_at, starCount: starHistory.star_count })
    }
  }

  return repoMap
}

type Props = {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)
  const table = viewToTable(search.view)

  const res = await getData(search.page, table)

  const histories = await getHistories(res.repositories.map((repo) => repo.id))

  return (
    <main className="container">
      <h1 className="text-3xl font-bold">Trending GitHub Repositories</h1>

      <div className="my-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Top Trending</h2>

        <TrendingFilter />
      </div>

      <TopTrendingWidgets table={table} />

      <h2 className="mb-4 mt-8 text-2xl font-bold">Trending {viewToTitle(search.view)}</h2>

      <div className="border-4">
        {res.repositories.map((repo) => (
          <div key={repo.github_id} className="flex border-t-4 p-4 first:border-t-0">
            <Image
              src={`https://github.com/${repo.name_with_owner.split('/')[0]}.png`}
              alt={`GitHub User Profile ${repo.name_with_owner}`}
              width="0"
              height="0"
              className="mr-4 h-[40px] w-[40px] self-center"
              unoptimized
            />

            <div className="flex flex-col">
              <div>
                <a
                  href={`https://github.com/${repo.name_with_owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-lg font-semibold text-blue-700 hover:underline dark:text-blue-500"
                >
                  {repo.name_with_owner}
                </a>
              </div>

              <span className="break-all line-clamp-3 text-sm dark:text-gray-400">{repo.description ?? ''}</span>

              <div className="mt-2 flex flex-col sm:flex-row sm:gap-4">
                {repo.primary_language && <span>{repo.primary_language}</span>}

                <div className="flex items-center gap-1">
                  <Star className="inline-block" size={16} />
                  {repo.star_count.toLocaleString()}
                </div>

                <div className="flex items-center gap-1">
                  <GitFork className="inline-block" size={16} />
                  {repo.fork_count.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="ml-auto items-center flex pl-4">
              <div className="w-16 h-16">
                <SimpleStarHistoryChart data={histories.get(repo.id) ?? []} />
              </div>

              <div className="flex flex-col items-center">
                <Triangle size={20} fill="currentColor" />

                <div className="mt-2 flex w-[68px] justify-center">
                  <NumberTicker
                    key={`${repo.github_id}-${search.view}`}
                    value={repo.stars_difference}
                    className="h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
