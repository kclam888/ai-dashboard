import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validatePassword } from '@/lib/validation'
import { rateLimit, rateLimitConfig, getRateLimitResponse } from '@/lib/rate-limit'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = headers().get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    // Check rate limit
    const rateLimitResult = await rateLimit(ip, 'auth:signup', rateLimitConfig.auth.signup)
    const rateLimitResponse = getRateLimitResponse(rateLimitResult)
    if (rateLimitResponse) return rateLimitResponse

    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password is too weak',
          errors: passwordValidation.errors
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser({ email, password, name })

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 3600000) // 24 hours from now

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    // Send verification email
    await sendVerificationEmail(email, token)

    return NextResponse.json(
      { 
        user,
        message: 'Please check your email to verify your account'
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': rateLimitConfig.auth.signup.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetIn.toString()
        }
      }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 