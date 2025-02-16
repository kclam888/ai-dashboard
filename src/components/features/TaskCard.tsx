'use client'

import React from 'react'
import { Bot } from 'lucide-react'
import StatusBadge from '@/components/shared/StatusBadge'

interface TaskCardProps {
  title: string
  status: 'queued' | 'in_progress' | 'completed' | 'failed'
  icon?: React.ReactNode
}

export default function TaskCard({ title, status, icon }: TaskCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#13111A] p-4">
      <div className="flex items-center space-x-3">
        {icon || <Bot className="h-5 w-5 text-gray-400" />}
        <span>{title}</span>
      </div>
      <StatusBadge status={status} />
    </div>
  )
} 