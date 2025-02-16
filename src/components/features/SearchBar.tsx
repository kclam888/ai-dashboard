'use client'

import React from 'react'
import { Search } from 'lucide-react'

export default function SearchBar() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="w-full rounded-lg bg-white/10 py-2 pl-10 pr-4 text-white placeholder-gray-400 outline-none focus:bg-white/20"
        placeholder="Search..."
      />
    </div>
  )
} 