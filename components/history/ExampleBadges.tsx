import { badgeVariants } from '../ui/badge'
import { db } from '@/db/client'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export const ExampleBadges = async () => {
  const repositories = await db
    .selectFrom('trend_weekly')
    .innerJoin('repositories', 'repositories.id', 'trend_weekly.repository_id')
    .select(['name_with_owner'])
    .limit(10)
    .execute()

  repositories.sort((a, b) => b.name_with_owner.length - a.name_with_owner.length)

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {repositories.map((repo) => (
        <Link
          href={{ query: { repository: repo.name_with_owner } }}
          key={repo.name_with_owner}
          className={cn(badgeVariants({ variant: 'outline' }), 'px-3 py-1 hover:bg-accent')}
        >
          {repo.name_with_owner}
        </Link>
      ))}
    </div>
  )
}
