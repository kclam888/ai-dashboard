'use client'

import React from 'react'

interface StatusBadgeProps {
  status: 'queued' | 'in_progress' | 'completed' | 'failed'
  className?: string
}

const statusColors = {
  queued: 'bg-[#4D4D4D]',
  in_progress: 'bg-[#2D7FF9]',
  completed: 'bg-green-500',
  failed: 'bg-red-500'
}

const statusLabels = {
  queued: 'Queued',
  in_progress: 'In Progress',
  completed: 'Completed',
  failed: 'Failed'
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`rounded-full ${statusColors[status]} px-3 py-1 text-sm ${className}`}>
      {statusLabels[status]}
    </span>
  )
} 