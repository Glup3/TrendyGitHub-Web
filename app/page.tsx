import { ModeToggle } from '@/components/ModeToggle'
import { SimplePagination } from '@/components/SimplePagination'
import NumberTicker from '@/components/magicui/NumberTicker'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { db } from '@/db/client'
import { AlertCircle, GitFork, Star, Triangle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { z } from 'zod'

const pageSchema = z.coerce.number().int().positive().catch(1)
const viewSchema = z.enum(['daily', 'weekly', 'monthly'])
const searchSchema = z.object({
  page: pageSchema,
  view: viewSchema.catch('daily'),
})

const perPage = 50

// 1-based index
async function getData(page: number, view: z.infer<typeof viewSchema>) {
  const table = view === 'daily' ? 'mv_daily_stars' : view === 'weekly' ? 'mv_weekly_stars' : 'mv_monthly_stars'

  const query = db
    .selectFrom(`${table} as mv_stars_history`)
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
    .limit(perPage)
    .offset(Math.round(pageSchema.parse(page) - 1) * perPage)

  const queryTotal = db
    .selectFrom(`${table} as mv_stars_history`)
    .select(({ fn }) => [fn.countAll<number>().as('total')])

  const [res, total] = await Promise.all([query.execute(), queryTotal.execute()])

  return {
    repositories: res,
    totalCount: total,
  }
}

type Props = {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)
  const res = await getData(search.page, search.view)

  return (
    <main className="container mx-auto">
      <Alert className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Maintenance</AlertTitle>
        <AlertDescription>The database is currently in maintenance mode and data is incomplete.</AlertDescription>
      </Alert>

      <h1 className="text-3xl font-bold">Trending GitHub Repositories</h1>

      <div className="my-2 flex justify-end">
        <div className="flex items-center">
          <Link className="mx-4" href={{ pathname: '/', query: { ...search, page: 1, view: 'daily' } }}>
            Daily
          </Link>
          <Link
            className="mx-4"
            href={{
              pathname: '/',
              query: { ...search, page: 1, view: 'weekly' },
            }}
          >
            Weekly
          </Link>
          <Link
            className="mx-4"
            href={{
              pathname: '/',
              query: { ...search, page: 1, view: 'monthly' },
            }}
          >
            Monthly
          </Link>

          <ModeToggle />
        </div>
      </div>

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
                  className="text-lg font-semibold text-blue-700 hover:underline dark:text-blue-500"
                >
                  {repo.name_with_owner}
                </a>
              </div>

              <span className="text-sm dark:text-gray-400">{repo.description ?? ''}</span>

              <div className="flex gap-4">
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

            <div className="ml-auto flex flex-col items-center justify-center pl-4">
              <Triangle size={20} fill="currentColor" />

              <div className="mt-2 flex w-[68px] justify-center">
                <NumberTicker key={`${repo.github_id}-${search.view}`} value={repo.stars_difference} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <SimplePagination
        className="my-4"
        currentPage={search.page}
        totalCount={res.totalCount[0]?.total ?? 0}
        perPage={perPage}
        getPageHref={(newPage) => ({ pathname: '/', query: { ...search, page: newPage } })}
      />
    </main>
  )
}
