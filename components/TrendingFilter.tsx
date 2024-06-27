'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { viewSchema } from '@/lib/schemas'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type View = 'daily' | 'weekly' | 'monthly'

const VIEWS: { label: string; value: View }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

export const TrendingFilter = () => {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const router = useRouter()

  return (
    <div>
      <Select
        value={viewSchema.parse(searchParams.get('view'))}
        onValueChange={(view) => {
          const params = new URLSearchParams(searchParams)
          params.set('view', view)
          params.delete('page')
          router.push(`${pathName}?${params.toString()}`)
        }}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="View" />
        </SelectTrigger>

        <SelectContent>
          {VIEWS.map((v) => (
            <SelectItem key={`view-${v.value}`} value={v.value}>
              {v.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
