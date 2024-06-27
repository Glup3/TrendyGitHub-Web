'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { viewSchema } from '@/lib/schemas'
import { ChevronDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type View = 'daily' | 'weekly' | 'monthly'
type Language = { name: string }

const VIEWS: { label: string; value: View }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

type Props = {
  language: string | undefined
  languages: Language[]
}

export const TrendingFilter = ({ language, languages }: Props) => {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const router = useRouter()

  return (
    <div className="flex sm:items-center justify-between sm:justify-normal sm:gap-4 mt-4 sm:mt-0">
      <ComboBoxResponsive language={language} languages={languages} />

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

type Item = {
  value: string
  label: string
}

const DEFAULT_VALUE = 'ANY'
const DEFAULT_LABEL = 'Any'
const DEFAULT_ITEM: Item = { value: DEFAULT_VALUE, label: 'Clear language' } as const

function ComboBoxResponsive({ language, languages }: { language: string | undefined; languages: Language[] }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedItem, setSelectedItem] = useState<Item>({
    value: language ?? DEFAULT_VALUE,
    label: language ?? DEFAULT_LABEL,
  })

  const items: Item[] = languages.map((lang) => {
    const value = lang.name.length > 0 ? lang.name : 'README'
    return { value: value, label: value }
  })

  if (language !== undefined) {
    items.unshift(DEFAULT_ITEM)
  }

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-between px-3">
            {selectedItem.label}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedItem} items={items} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          {selectedItem.label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedItem} items={items} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
  items,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: Item) => void
  items: Item[]
}) {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const router = useRouter()

  return (
    <Command>
      <CommandInput placeholder="Filter language..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={`language-${item.value}`}
              value={item.value}
              onSelect={(value) => {
                setSelectedStatus({ value, label: value === DEFAULT_VALUE ? DEFAULT_LABEL : item.label })
                setOpen(false)

                const params = new URLSearchParams(searchParams)
                if (value === DEFAULT_VALUE) {
                  params.delete('language')
                } else {
                  params.set('language', value)
                }
                params.delete('page')
                router.push(`${pathName}?${params.toString()}`)
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
