import { type searchSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { type z } from 'zod'

type Search = z.infer<typeof searchSchema>

type Props = {
  search: Search
}

export const SidebarFilter = ({ search }: Props) => {
  return (
    <aside className="sticky top-10 ml-10 mt-12 hidden h-screen w-[200px] overflow-y-auto sm:block">
      <div className="mb-4">
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

      {/* <div> */}
      {/*   <p>Language filter</p> */}
      {/*   <ul> */}
      {/*     {res.languages.slice(0, 16).map((l) => ( */}
      {/*       <li key={`lang-${l.primary_language}`}>{l.primary_language}</li> */}
      {/*     ))} */}
      {/*   </ul> */}
      {/* </div> */}
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
