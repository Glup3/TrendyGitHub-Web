import { ExampleBadges } from '@/components/history/ExampleBadges'
import { RepoInput } from '@/components/history/RepoInput'
import { StarHistoryChart } from '@/components/history/StarHistoryChart'
import { db } from '@/db/client'
import Image from 'next/image'
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

      <ExampleBadges />

      {!search.repository ? null : result.length > 0 ? (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Image
              src={`https://github.com/${search.repository.split('/')[0]}.png`}
              alt={`GitHub User Logo ${search.repository}`}
              width="0"
              height="0"
              className="size-8 rounded"
              unoptimized
            />

            <h2 className="text-2xl font-bold">{search.repository}</h2>
          </div>
          <div className="aspect-video w-full">
            <StarHistoryChart
              repoName={search.repository}
              data={result.map((r) => ({ date: r.created_at.getTime(), repo: r.star_count }))}
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
