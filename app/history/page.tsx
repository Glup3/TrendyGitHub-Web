import { RepoInput } from '@/components/history/RepoInput'
import { StarHistoryChart } from '@/components/history/StarHistoryChart'
import { db } from '@/db/client'
import { z } from 'zod'

const searchSchema = z.object({
  repository: z.string().optional(),
})

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function HistoryPage({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)

  const result = search.repository
    ? await db
        .selectFrom('repositories as r')
        .innerJoin('stars_history as h', 'h.repository_id', 'r.id')
        .select(['r.name_with_owner', 'r.id', 'h.star_count', 'h.created_at'])
        .where('r.name_with_owner', '=', search.repository)
        .orderBy('r.name_with_owner')
        .orderBy('h.created_at')
        .execute()
    : []

  return (
    <main className="container">
      <h1 className="text-3xl font-bold">Star History</h1>

      <RepoInput initialText={search.repository} />

      {!search.repository ? null : result.length > 0 ? (
        <div className="h-[600px] w-full">
          <StarHistoryChart
            repoName={search.repository}
            data={result.map((r) => ({ date: r.created_at.getTime(), repo: r.star_count }))}
          />
        </div>
      ) : (
        <div>no repo found...</div>
      )}
    </main>
  )
}
