'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next-nprogress-bar'
import { usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Item = {
  value: string
  label: string
}

export const LanguagesDropDown = ({ languages, selectedValue }: { languages: Item[]; selectedValue: string }) => {
  const initialIndex = languages.findIndex((i) => i.value === selectedValue)
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(initialIndex >= 0 ? initialIndex : null)

  const searchParams = useSearchParams()
  const pathName = usePathname()
  const router = useRouter()
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={selectedIndex ? 'default' : 'outline'} className="w-full justify-between px-3">
          {selectedIndex ? languages[selectedIndex].label : 'Other Languages'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Filter language..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {languages.map((item) => (
                <CommandItem
                  key={`language-${item.value}`}
                  value={item.value}
                  onSelect={(value) => {
                    setSelectedIndex(languages.findIndex((i) => i.value === value))
                    setOpen(false)

                    const params = new URLSearchParams(searchParams)
                    params.delete('page')
                    params.set('language', value)
                    void router.push(`${pathName}?${params.toString()}`)
                  }}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
