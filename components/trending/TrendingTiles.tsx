import { SimpleStarHistoryChart } from '../SimpleStarHistoryChart'
import NumberTicker from '../magicui/NumberTicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { getAllLanguages, getMonthlyStarHistories, getStarsRankingQuery } from '@/db/queries'
import { GitFork, Star, Triangle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  page: number // 1-based index
  pageSize: number
  language: string
  view: string
}

export const TrendingTiles = async ({ page, pageSize, language, view }: Props) => {
  const repositories = await getStarsRankingQuery({
    table: viewToTable(view),
    perPage: pageSize,
    offset: Math.round(page - 1) * pageSize,
    language,
  }).execute()

  const languages = new Map((await getAllLanguages()).map((l) => [l.id, l.hexcolor]))

  const histories = await getHistories(repositories.map((repo) => repo.id))

  return (
    <div className="flex flex-col gap-4">
      {repositories.map((repo) => (
        <Card
          key={repo.github_id}
          className="shadow-none transition-shadow duration-200 hover:shadow-lg dark:hover:shadow-slate-800"
        >
          <div className="flex p-6">
            <CardHeader className="flex-1 p-0">
              <CardTitle className="text-lg sm:text-xl">
                <a
                  href={`https://github.com/${repo.name_with_owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  {repo.name_with_owner.split('/').join(' / ')}
                </a>
              </CardTitle>

              <CardDescription className="max-w-prose break-all">{repo.description ?? ''}</CardDescription>
            </CardHeader>

            <Image
              src={`https://github.com/${repo.name_with_owner.split('/')[0]}.png`}
              alt={`GitHub User Logo ${repo.name_with_owner}`}
              width="0"
              height="0"
              className="ml-4 h-[40px] w-[40px] flex-shrink-0 rounded"
              unoptimized
            />
          </div>

          <CardContent>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div
                  className="mr-1 h-3 w-3 rounded-full"
                  style={{ backgroundColor: languages.get(repo.primary_language) ?? '#64748B' }}
                />
                <span>{repo.primary_language ? repo.primary_language : 'README'}</span>
              </div>

              <div className="flex items-center">
                <Star className="mr-1 inline-block" size={12} />
                {repo.star_count.toLocaleString()}
              </div>

              <div className="flex items-center">
                <GitFork className="mr-1 inline-block" size={12} />
                {repo.fork_count.toLocaleString()}
              </div>

              <div className="flex items-center gap-1 sm:ml-auto">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={{ pathname: '/history', query: { repository: repo.name_with_owner } }}>
                        <div className="h-6 w-8">
                          <SimpleStarHistoryChart
                            data={(histories.get(repo.id) ?? []).map((h) => ({
                              date: h.date,
                              starCount: h.starCount - repo.star_count,
                            }))}
                          />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Star History</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Triangle className="inline-block" size={12} />
                <NumberTicker key={`ticker-${repo.github_id}-${view}`} value={repo.stars_difference} />
                stars {viewToText(view)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const TrendingTilesSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <Card key={`trending-skeleton-${i}`} className="p-6">
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-5 w-[280px]" />
                <Skeleton className="mt-3 h-4 w-[240px]" />
              </div>

              <Skeleton className="h-[40px] w-[40px] rounded" />
            </div>

            <div className="mt-8 flex justify-between">
              <Skeleton className="h-4 w-[240px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </Card>
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

function viewToText(view: string) {
  switch (view) {
    case 'daily':
      return 'today'
    case 'weekly':
      return 'this week'
    case 'monthly':
      return 'this month'
    default:
      return 'today'
  }
}
