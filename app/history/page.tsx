import { ExampleBadges } from '@/components/history/ExampleBadges'
import { RepoInput } from '@/components/history/RepoInput'
import { StarLineChart } from '@/components/history/StarLineChart'
import { db } from '@/db/client'
import { Suspense } from 'react'
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
        .select(['r.name_with_owner', 'r.id', 'h.star_count', 'h.created_at', 'primary_language'])
        .where('r.name_with_owner', '=', search.repository)
        .orderBy('r.name_with_owner')
        .orderBy('h.created_at')
        .execute()
    : []

  const language = result[0]?.primary_language
    ? await db
        .selectFrom('languages')
        .select('hexcolor')
        .where('id', '=', result[0].primary_language)
        .executeTakeFirst()
    : undefined

  return (
    <main className="container">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-[-0.02em]">Star History</h1>
        <p className="leading-loose">
          Visualize how the star count of any GitHub repository changes over time with our linear chart. Simply enter
          the repository name or paste the full URL into the input bar to get started.
        </p>
      </div>

      <RepoInput initialText={search.repository} />

      <h2 className="mb-2 text-sm font-semibold">Popular Repositories</h2>

      <Suspense>
        <ExampleBadges />
      </Suspense>

      {!search.repository ? null : result.length > 0 ? (
        <div>
          <div className="aspect-video w-full">
            <StarLineChart
              lineColor={language?.hexcolor ?? '#64748B'}
              repositoryName={search.repository}
              data={result.map((r) => ({ date: r.created_at, count: r.star_count }))}
            />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mb-2 hyphens-auto text-2xl font-bold">Repository &quot;{search.repository}&quot; Not Found</h2>
          <p>
            We couldn&apos;t locate the repository you searched for. It might be spelled incorrectly or currently
            unavailable. Please try again with a different name.
          </p>
        </div>
      )}
    </main>
  )
}
