import { ModeToggle } from '@/components/ModeToggle'
import { db } from '@/db/client'
import { GitFork, Star, Triangle } from 'lucide-react'
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

  return await db
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
    .execute()
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
      <h1>Trending GitHub Repositories</h1>

      <div>
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

      <div>
        {search.page > 1 && (
          <Link
            className="mx-4"
            href={{
              pathname: '/',
              query: { ...search, page: search.page - 1 },
            }}
          >
            Prev
          </Link>
        )}
        <span>{search.page}</span>
        <Link className="mx-4" href={{ pathname: '/', query: { ...search, page: search.page + 1 } }}>
          Next
        </Link>
      </div>

      <div className="border-4">
        {res.map((repo, index) => (
          <div key={repo.github_id} className="flex border-t-4 p-4 first:border-t-0">
            <div className="mr-4 self-center">{(search.page - 1) * perPage + index + 1}</div>

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

            <div className="ml-auto flex items-center gap-1 self-center pl-4">
              <Triangle size={18} />
              <Star size={18} />
              {repo.stars_difference.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
