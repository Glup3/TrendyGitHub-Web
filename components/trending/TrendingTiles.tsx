import { SimpleStarHistoryChart } from '../SimpleStarHistoryChart'
import NumberTicker from '../magicui/NumberTicker'
import { getMonthlyStarHistories, getStarsRankingQuery } from '@/db/queries'
import { GitFork, Star, Triangle } from 'lucide-react'
import Image from 'next/image'

const PER_PAGE = 50

type Props = {
  page: number // 1-based index
  language: string | undefined
  view: string
}

export const TrendingTiles = async ({ page, language, view }: Props) => {
  const repositories = await getStarsRankingQuery({
    table: viewToTable(view),
    perPage: PER_PAGE,
    offset: Math.round(page - 1) * PER_PAGE,
    language,
  }).execute()

  const histories = await getHistories(repositories.map((repo) => repo.id))

  return (
    <div className="border-4">
      {repositories.map((repo) => (
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

            <span className="line-clamp-3 break-all text-sm dark:text-gray-400">{repo.description ?? ''}</span>

            <div className="mt-2 flex flex-col sm:flex-row sm:gap-4">
              <span>{repo.primary_language ? repo.primary_language : 'README'}</span>

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

          <div className="ml-auto flex items-center pl-4">
            <div className="h-16 w-16">
              <SimpleStarHistoryChart data={histories.get(repo.id) ?? []} />
            </div>

            <div className="flex flex-col items-center">
              <Triangle size={20} fill="currentColor" />

              <div className="mt-2 flex w-[68px] justify-center">
                <NumberTicker key={`${repo.github_id}-${view}`} value={repo.stars_difference} className="h-6" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function getHistories(repoIds: number[]) {
  const repoMap = new Map<number, { date: Date; starCount: number }[]>()

  if (repoIds.length === 0) {
    return repoMap
  }

  const histories = await getMonthlyStarHistories(repoIds).execute()

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
function viewToTable(view: string) {
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
