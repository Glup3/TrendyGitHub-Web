import { ModeToggle } from './ModeToggle'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Navbar = () => {
  return (
    <nav className="container py-4">
      <div className="flex sm:items-center flex-col sm:flex-row sm:justify-between gap-2">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/icon.svg" width={32} height={32} alt="Trending Repos Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Trending Repos</span>
        </Link>

        <div>
          <ul className="font-medium flex items-center p-0 rounded-lg space-x-6 mt-0 border-0 flex-wrap">
            <li>
              <Link
                href="/"
                className="block rounded md:bg-transparent text-blue-700 md:p-0 dark:text-blue-500"
                aria-current="page"
              >
                Trends
              </Link>
            </li>
            <li>
              <Link
                href="/statistics"
                // TODO: adapt css
                className="block text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
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
