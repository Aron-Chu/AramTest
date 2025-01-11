// components/Layout.tsx

import React, { ReactNode } from 'react'
import Link from 'next/link'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header / Nav Bar */}
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold text-white hover:text-gray-300">
            ARAM Stats
          </a>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/leaderboard">
                <a className="hover:text-gray-300">Leaderboard</a>
              </Link>
            </li>
            <li>
              <Link href="/champions">
                <a className="hover:text-gray-300">Champions</a>
              </Link>
            </li>
            {/* Add more nav links as needed */}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} ARAM Stats. Not affiliated with Riot Games.</p>
      </footer>
    </div>
  )
}
