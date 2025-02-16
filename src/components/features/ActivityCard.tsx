'use client'

import React from 'react'
import { Bot } from 'lucide-react'

interface ActivityCardProps {
  title: string
  timestamp: string
  description: string
  source: string
  icon?: React.ReactNode
}

export default function ActivityCard({ title, timestamp, description, source, icon }: ActivityCardProps) {
  return (
    <div className="rounded-lg bg-[#13111A] p-6">
      <div className="mb-4 flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D7FF9]">
          {icon || <Bot className="h-5 w-5 text-white" />}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-400">{timestamp}</p>
        </div>
      </div>

      <div className="rounded-lg bg-[#1A1721] p-4">
        <p className="text-gray-300">{description}</p>
        <p className="mt-2 text-sm text-gray-400">via {source}</p>
      </div>
    </div>
  )
} 