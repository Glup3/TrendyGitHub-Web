import NumberTicker from './magicui/NumberTicker'
import { HistoryTable, getStarsRankingQuery } from '@/db/queries'
import { Triangle } from 'lucide-react'
import Image from 'next/image'

export const TopTrendingWidgets = async ({ table }: { table: HistoryTable }) => {
  const repos = await getStarsRankingQuery({ table: table, offset: 0, perPage: 3 }).execute()

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {repos.map((repo) => (
        <div key={`repo-${repo.github_id}`} className="flex flex-1 border-4 p-4">
          <Image
            src={`https://github.com/${repo.name_with_owner.split('/')[0]}.png`}
            alt={`GitHub User Profile ${repo.name_with_owner}`}
            width="0"
            height="0"
            className="mr-4 h-[40px] w-[40px]"
            unoptimized
          />

          <div className="flex flex-col">
            <a
              href={`https://github.com/${repo.name_with_owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-lg font-semibold text-blue-700 hover:underline dark:text-blue-500"
            >
              {repo.name_with_owner}
            </a>

            <span className="text-sm line-clamp-4 dark:text-gray-400">{repo.description ?? ''}</span>
          </div>

          <div className="ml-auto flex flex-col items-center justify-center pl-4">
            <Triangle size={20} fill="currentColor" />

            <div className="mt-2 flex w-[68px] justify-center">
              <NumberTicker key={`top-${repo.github_id}`} value={repo.stars_difference} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
