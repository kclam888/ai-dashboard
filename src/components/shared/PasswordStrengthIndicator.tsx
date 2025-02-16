'use client'

import React from 'react'
import { validatePassword } from '@/lib/validation'
import { cn } from '@/lib/utils'

interface PasswordStrengthIndicatorProps {
  password: string
  className?: string
}

export default function PasswordStrengthIndicator({
  password,
  className
}: PasswordStrengthIndicatorProps) {
  const { score, errors } = validatePassword(password)

  const getStrengthLabel = (score: number) => {
    if (score === 0) return 'Very Weak'
    if (score === 1) return 'Weak'
    if (score === 2) return 'Fair'
    if (score === 3) return 'Good'
    if (score === 4) return 'Strong'
    return 'Very Strong'
  }

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-red-500'
    if (score === 1) return 'bg-orange-500'
    if (score === 2) return 'bg-yellow-500'
    if (score === 3) return 'bg-green-500'
    if (score === 4) return 'bg-emerald-500'
    return 'bg-blue-500'
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="h-2 flex-1 space-x-1 rounded-full bg-white/5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-full w-full rounded-full transition-all duration-300',
                i < score ? getStrengthColor(score) : 'bg-white/5'
              )}
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-400">
          {getStrengthLabel(score)}
        </span>
      </div>
      {errors.length > 0 && (
        <ul className="space-y-1 text-sm text-red-500">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  )
} 