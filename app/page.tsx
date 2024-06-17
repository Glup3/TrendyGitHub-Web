import { ModeToggle } from '@/components/ModeToggle'
import { db } from '@/db/client'
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
    .select(['github_id', 'name_with_owner', 'star_count', 'fork_count', 'primary_language', 'stars_difference'])
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
    <main>
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

      <div>
        {res.map((repo) => (
          <div key={repo.github_id}>
            {repo.stars_difference} - {repo.name_with_owner}
          </div>
        ))}
      </div>
    </main>
  )
}
