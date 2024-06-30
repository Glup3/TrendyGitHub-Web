import { LanguagesDropDown } from '../LanguagesDropDown'
import { getAllLanguages } from '@/db/queries'
import { type searchSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { type z } from 'zod'

type Search = z.infer<typeof searchSchema>

const popularLanguages = [
  { id: 'All', label: 'All Languages' },
  { id: 'Python', label: 'Python' },
  { id: 'JavaScript', label: 'JavaScript' },
  { id: 'TypeScript', label: 'TypeScript' },
  { id: 'Gleam', label: 'Gleam' },
  { id: 'Go', label: 'Go' },
  { id: 'Rust', label: 'Rust' },
  { id: 'Zig', label: 'Zig' },
  { id: 'Elixir', label: 'Elixir' },
  { id: 'Dart', label: 'Dart' },
  { id: 'PHP', label: 'PHP' },
  { id: 'Unknown', label: 'Unknown' },
] as const

type Props = {
  search: Search
}

export const SidebarFilter = async ({ search }: Props) => {
  const languages = await getAllLanguages()
  const filteredLanguages = languages.filter((l) => !popularLanguages.some((p) => p.id === l.id))

  return (
    <aside className="sticky top-10 ml-10 mt-12 hidden h-screen w-[200px] overflow-y-auto px-1 sm:block">
      <div className="mb-8">
        <p className="my-2 text-sm font-semibold">Time filter</p>
        <ul className="space-y-1 text-sm">
          {timeFilters.map((t) => {
            const activeStyle = t.view === search.view && 'bg-primary text-primary-foreground'
            const hoverStyle = t.view !== search.view && 'hover:bg-accent hover:text-accent-foreground'

            return (
              <li key={`time-filter-${t.view}`}>
                <Link
                  href={{ pathname: '/', query: { ...search, view: t.view, page: 1 } }}
                  className={cn(`inline-block w-full rounded px-2 py-1`, activeStyle, hoverStyle)}
                >
                  {t.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <p className="my-2 text-sm font-semibold">Language filter</p>
        <ul className="mb-2 space-y-1 text-sm">
          {popularLanguages.map((l) => {
            const activeStyle = l.id === search.language && 'bg-primary text-primary-foreground'
            const hoverStyle = l.id !== search.language && 'hover:bg-accent hover:text-accent-foreground'

            return (
              <li key={`language-filter-${l.id}`}>
                <Link
                  href={{ pathname: '/', query: { ...search, language: l.id, page: 1 } }}
                  className={cn(`inline-block w-full rounded px-2 py-1`, activeStyle, hoverStyle)}
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="ml-1">
          <LanguagesDropDown
            key={`lang-${search.language}`}
            languages={filteredLanguages.map((l) => ({ value: l.id, label: l.id }))}
            selectedValue={search.language}
          />
        </div>
      </div>
    </aside>
  )
}

type TimeFilter = {
  view: Search['view']
  label: string
}

const timeFilters: TimeFilter[] = [
  { view: 'daily', label: 'Daily' },
  { view: 'weekly', label: 'Weekly' },
  { view: 'monthly', label: 'Monthly' },
]
