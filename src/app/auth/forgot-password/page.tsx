'use client'

import React, { useState } from 'react'
import { Bot, Mail } from 'lucide-react'
import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const { isAuthenticated } = useAuth(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#13111A] px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
              Check your email
            </h2>
            <p className="mt-2 text-gray-400">
              If an account exists with {email}, we've sent a password reset link.
            </p>
          </div>
          <div className="mt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setSuccess(false)
                setEmail('')
              }}
            >
              Try another email
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#13111A] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2D7FF9]">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-lg bg-[#1A1721] p-6">
            <Input
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              icon={Mail}
              error={error}
            />
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Sending reset link...' : 'Send reset link'}
            </Button>

            <p className="text-center text-sm text-gray-400">
              Remember your password?{' '}
              <a href="/auth/signin" className="text-[#2D7FF9] hover:text-[#2D7FF9]/90">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 