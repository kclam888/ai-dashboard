'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Lock, Camera, Github, LogOut } from 'lucide-react'
import { signOut, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Button from '@/components/shared/Button'
import Input from '@/components/shared/Input'
import { useAuth } from '@/hooks/useAuth'
import PasswordStrengthIndicator from '@/components/shared/PasswordStrengthIndicator'
import { validatePassword } from '@/lib/validation'

export default function ProfilePage() {
  const router = useRouter()
  const { session } = useAuth(true)
  const user = session?.user
  
  const [name, setName] = useState<string>('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState<{ provider: string; providerAccountId: string }[]>([])

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      setAccounts(data.user.accounts || [])
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    const updates: any = { name }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match')
        setIsLoading(false)
        return
      }

      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.isValid) {
        setError('Please fix the password issues before continuing')
        setIsLoading(false)
        return
      }

      updates.currentPassword = currentPassword
      updates.newPassword = newPassword
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setSuccess('Profile updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnectAccount = async (provider: string) => {
    try {
      const response = await fetch(`/api/user/connections?provider=${provider}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to disconnect ${provider}`)
      }

      setSuccess(`Successfully disconnected ${provider}`)
      fetchProfile()
    } catch (error) {
      setError(error instanceof Error ? error.message : `Failed to disconnect ${provider}`)
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/auth/signin')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#13111A] py-12">
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="mt-2 text-gray-400">
            Manage your account settings and preferences.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-500/10 p-4 text-green-500">
            {success}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          {/* Profile Information */}
          <div className="space-y-4 rounded-lg bg-[#1A1721] p-6">
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`}
                  alt={user.name || 'Profile'}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 rounded-full bg-[#2D7FF9] p-2 text-white hover:bg-[#2D7FF9]/90"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1">
                <Input
                  label="Full name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  icon={User}
                />
              </div>
            </div>

            <Input
              label="Email address"
              type="email"
              value={user.email || ''}
              disabled
              icon={Mail}
              helperText="Email cannot be changed"
            />
          </div>

          {/* Connected Accounts */}
          <div className="space-y-4 rounded-lg bg-[#1A1721] p-6">
            <h2 className="text-xl font-semibold text-white">Connected Accounts</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-[#13111A] p-4">
                <div className="flex items-center space-x-3">
                  <Github className="h-6 w-6 text-white" />
                  <div>
                    <p className="font-medium text-white">GitHub</p>
                    <p className="text-sm text-gray-400">
                      {accounts.find(a => a.provider === 'github')
                        ? 'Connected'
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={accounts.find(a => a.provider === 'github') ? 'destructive' : 'secondary'}
                  onClick={() => {
                    if (accounts.find(a => a.provider === 'github')) {
                      handleDisconnectAccount('github')
                    } else {
                      signIn('github')
                    }
                  }}
                >
                  {accounts.find(a => a.provider === 'github') ? 'Disconnect' : 'Connect'}
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-[#13111A] p-4">
                <div className="flex items-center space-x-3">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-white">Google</p>
                    <p className="text-sm text-gray-400">
                      {accounts.find(a => a.provider === 'google')
                        ? 'Connected'
                        : 'Not connected'}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={accounts.find(a => a.provider === 'google') ? 'destructive' : 'secondary'}
                  onClick={() => {
                    if (accounts.find(a => a.provider === 'google')) {
                      handleDisconnectAccount('google')
                    } else {
                      signIn('google')
                    }
                  }}
                >
                  {accounts.find(a => a.provider === 'google') ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="space-y-4 rounded-lg bg-[#1A1721] p-6">
            <h2 className="text-xl font-semibold text-white">Change Password</h2>
            
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              icon={Lock}
            />

            <div className="space-y-2">
              <Input
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                icon={Lock}
              />
              {newPassword && <PasswordStrengthIndicator password={newPassword} />}
            </div>

            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              icon={Lock}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving changes...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 