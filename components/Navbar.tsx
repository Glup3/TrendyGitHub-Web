import { CurrentPageProvider } from './CurrentPageProvider'
import { ModeToggle } from './ModeToggle'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const pages: { name: string; href: string }[] = [
  { name: 'Trending', href: '/' },
  { name: 'Star History', href: '/history' },
  // { name: 'Ranking', href: '/ranking' },
  // { name: 'Statistics', href: '/statistics' },
]

export const Navbar = () => {
  return (
    <nav className="container py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.svg" width={32} height={32} alt="Trending Repos Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">Trending Repos</span>
        </Link>

        <div>
          <ul className="mt-0 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border-0 p-0 font-medium">
            {pages.map((page) => (
              <CurrentPageProvider href={page.href} key={page.href}>
                <Link href={page.href} className="hover:text-primary group-[.active-page]:text-primary">
                  {page.name}
                </Link>
              </CurrentPageProvider>
            ))}

            <li>
              <a
                href="https://github.com/Glup3/TrendyGitHub-Web"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                GitHub
              </a>
            </li>

            <li>
              <ModeToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
