import { SimplePagination } from '@/components/SimplePagination'
import { RepoCards } from '@/components/ranking/RepoCards'
import { db } from '@/db/client'
import { searchSchema } from '@/lib/schemas'
import { Suspense } from 'react'

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

const PAGE_SIZE = 100
// 1-based index
async function getData() {
  const [total] = await Promise.all([
    db
      .selectFrom('repositories')
      .select(({ fn }) => [fn.countAll<number>().as('total')])
      .executeTakeFirst(),
  ])

  return {
    totalCount: total?.total ?? 0,
  }
}

export default async function RankingPage({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)
  const resp = await getData()

  return (
    <main className="container">
      <h1 className="mb-4 text-3xl font-bold">Most Starred GitHub Repositories</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <RepoCards page={search.page} pageSize={PAGE_SIZE} language={search.language} />
      </Suspense>

      <SimplePagination
        className="my-4"
        currentPage={search.page}
        totalCount={resp.totalCount}
        pageSize={PAGE_SIZE}
        getPageHref={(newPage) => ({ pathname: '/ranking', query: { ...search, page: newPage } })}
      />
    </main>
  )
}
