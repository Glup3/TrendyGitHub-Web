'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { type PropsWithChildren } from 'react'

type Props = {
  href: string
}

export const CurrentPageProvider = ({ href, children }: PropsWithChildren<Props>) => {
  const pathname = usePathname()

  const active = href === '/' ? pathname === href : pathname.startsWith(href)

  return <li className={cn('group', { 'active-page': active })}>{children}</li>
}
