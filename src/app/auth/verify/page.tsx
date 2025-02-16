'use client'

import React, { useEffect, useState } from 'react'
import { Bot, Mail, CheckCircle, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/shared/Button'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed')
        }

        setStatus('success')
        setMessage('Your email has been verified successfully')
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Verification failed')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#13111A] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2D7FF9]">
            {status === 'loading' ? (
              <Mail className="h-8 w-8 text-white" />
            ) : status === 'success' ? (
              <CheckCircle className="h-8 w-8 text-white" />
            ) : (
              <XCircle className="h-8 w-8 text-white" />
            )}
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            {status === 'loading'
              ? 'Verifying your email'
              : status === 'success'
              ? 'Email verified'
              : 'Verification failed'}
          </h2>
          <p className="mt-2 text-gray-400">{message}</p>
        </div>

        <div className="mt-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push('/auth/signin')}
          >
            {status === 'success' ? 'Sign in' : 'Back to sign in'}
          </Button>
        </div>
      </div>
    </div>
  )
} 