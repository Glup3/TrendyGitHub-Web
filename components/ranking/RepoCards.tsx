import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { db } from '@/db/client'
import { DEFAULT_LANGUAGE } from '@/lib/schemas'
import { GitFork, Star } from 'lucide-react'
import Image from 'next/image'

type Props = {
  page: number // 1-based index
  pageSize: number
  language: string
}

export const RepoCards = async ({ page, pageSize, language }: Props) => {
  let query = db
    .selectFrom('repositories')
    .select(['github_id', 'name_with_owner', 'star_count', 'fork_count', 'description', 'primary_language'])
    .orderBy('star_count', 'desc')
    .orderBy('id')
    .limit(pageSize)
    .offset(Math.round(page - 1) * pageSize)

  if (language !== DEFAULT_LANGUAGE) {
    query = query.where('primary_language', 'ilike', language)
  }

  const repositories = await query.execute()

  return (
    <div className="flex flex-col gap-4">
      {repositories.map((repo) => (
        <Card key={repo.github_id} className="shadow-none transition-shadow duration-200 hover:shadow-lg">
          <div className="flex p-6">
            <CardHeader className="flex-1 p-0">
              <CardTitle className="text-lg sm:text-xl">
                <a
                  href={`https://github.com/${repo.name_with_owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  {repo.name_with_owner.split('/').join(' / ')}
                </a>
              </CardTitle>

              <CardDescription className="max-w-prose break-all">{repo.description ?? ''}</CardDescription>
            </CardHeader>

            <Image
              src={`https://github.com/${repo.name_with_owner.split('/')[0]}.png`}
              alt={`GitHub User Logo ${repo.name_with_owner}`}
              width="0"
              height="0"
              className="ml-4 h-[40px] w-[40px] flex-shrink-0 rounded"
              unoptimized
            />
          </div>

          <CardContent>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="mr-1 h-3 w-3 rounded-full bg-primary"></div>
                <span>{repo.primary_language ? repo.primary_language : 'README'}</span>
              </div>

              <div className="flex items-center">
                <Star className="mr-1 inline-block" size={12} />
                {repo.star_count.toLocaleString()}
              </div>

              <div className="flex items-center">
                <GitFork className="mr-1 inline-block" size={12} />
                {repo.fork_count.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
