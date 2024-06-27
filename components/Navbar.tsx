import { ModeToggle } from './ModeToggle'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
  return (
    <nav className="container py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/icon.svg" width={32} height={32} alt="Trending Repos Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">Trending Repos</span>
        </Link>

        <div>
          <ul className="mt-0 flex flex-wrap items-center space-x-6 rounded-lg border-0 p-0 font-medium">
            <li>
              <Link
                href="/"
                className="block rounded text-blue-700 dark:text-blue-500 md:bg-transparent md:p-0"
                aria-current="page"
              >
                Trends
              </Link>
            </li>
            <li>
              <Link
                href="/ranking"
                className="block rounded text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
              >
                Ranking
              </Link>
            </li>
            <li>
              <Link
                href="/statistics"
                // TODO: adapt css
                className="block rounded text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
              >
                Statistics
              </Link>
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
