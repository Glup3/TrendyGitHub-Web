import { ExampleBadges } from '@/components/history/ExampleBadges'
import { RepoInput } from '@/components/history/RepoInput'
import { StarLineChart } from '@/components/history/StarLineChart'
import { db } from '@/db/client'
import { type Metadata } from 'next'
import { Suspense } from 'react'
import { z } from 'zod'

const searchSchema = z.object({
  repository: z.string().optional(),
})

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateMetadata(props: Props): Promise<Metadata> {
  const search = searchSchema.parse(props.searchParams)
  const repoName = search.repository ?? ''

  return {
    title: `Star History ${repoName}`,
    description:
      'Track the star history of any GitHub repository with our interactive tool. Simply enter the repository name or URL to visualize the star count trends over time. Stay updated with the latest popular repositories and analyze their growth patterns effortlessly. Perfect for developers, analysts, and tech enthusiasts!',
  }
}

export default async function HistoryPage({ searchParams }: Props) {
  const search = searchSchema.parse(searchParams)

  const result = search.repository
    ? await db
        .selectFrom('repositories as r')
        .innerJoin('stars_history_hyper as h', 'h.repository_id', 'r.id')
        .select(['r.name_with_owner', 'r.id', 'h.star_count', 'h.date', 'primary_language'])
        .where('r.name_with_owner', '=', search.repository)
        .orderBy('r.name_with_owner')
        .orderBy('h.date')
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

      {search.repository && result.length === 0 && (
        <div className="mb-4">
          <h2 className="mb-2 hyphens-auto text-2xl font-bold">Repository &quot;{search.repository}&quot; Not Found</h2>
          <p>
            We couldn&apos;t locate the repository you searched for. It might be spelled incorrectly or currently
            unavailable. Please try again with a different name.
          </p>
        </div>
      )}

      {search.repository && result.length > 0 && (
        <div>
          <StarLineChart
            lineColor={language?.hexcolor ?? '#64748B'}
            repositoryName={search.repository}
            data={result.map((r) => ({ date: r.date, count: r.star_count }))}
          />
        </div>
      )}
    </main>
  )
}
