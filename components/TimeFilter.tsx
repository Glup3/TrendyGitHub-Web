import { type searchSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { type z } from 'zod'

type Search = z.infer<typeof searchSchema>

type TimeFilter = {
  view: Search['view']
  label: string
}

const timeFilters: TimeFilter[] = [
  { view: 'daily', label: 'Daily' },
  { view: 'weekly', label: 'Weekly' },
  { view: 'monthly', label: 'Monthly' },
]

type Props = {
  search: Search
  className?: string
}

export const TimeFilter = ({ search, className }: Props) => {
  return (
    <div className={cn(className)}>
      <p className="my-2 text-lg font-semibold">Time filter</p>
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
  )
}
