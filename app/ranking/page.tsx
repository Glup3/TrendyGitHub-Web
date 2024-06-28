import { SimplePagination } from '@/components/SimplePagination'
import { db } from '@/db/client'
import { GitFork, Star } from 'lucide-react'
import Image from 'next/image'
import { z } from 'zod'

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

const pageSchema = z.coerce.number().int().positive().catch(1)
const searchSchema = z.object({
  page: pageSchema,
})

const perPage = 100
// 1-based index
async function getData(page: number) {
  const offset = Math.round(pageSchema.parse(page) - 1) * perPage

  const query1 = db
    .selectFrom('repositories')
    .select(['github_id', 'name_with_owner', 'star_count', 'fork_count', 'description', 'primary_language'])
    .orderBy('star_count', 'desc')
    .orderBy('id')
    .limit(perPage)
    .offset(offset)

  const query2 = db.selectFrom('repositories').select(({ fn }) => [fn.countAll<number>().as('total')])

  const [repos, total] = await Promise.all([query1.execute(), query2.execute()])

  return {
    repositories: repos,
    totalCount: total[0]?.total ?? 0,
  }
}

export default async function RankingPage({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)
  const resp = await getData(search.page)

  return (
    <main className="container">
      <h1 className="mb-4 text-3xl font-bold">Most Starred GitHub Repositories</h1>

      <div className="border-4">
        {resp.repositories.map((repo) => (
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
          </div>
        ))}
      </div>

      <SimplePagination
        className="my-4"
        currentPage={search.page}
        totalCount={resp.totalCount}
        pageSize={perPage}
        getPageHref={(newPage) => ({ pathname: '/ranking', query: { ...search, page: newPage } })}
      />
    </main>
  )
}
