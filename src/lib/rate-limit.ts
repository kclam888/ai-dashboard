import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

let redis: Redis | null = null

// Only initialize Redis if credentials are available
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

interface RateLimitConfig {
  interval: number // in seconds
  limit: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  interval: 60, // 1 minute
  limit: 5 // 5 requests per minute
}

export async function rateLimit(
  ip: string,
  action: string,
  config: RateLimitConfig = DEFAULT_CONFIG
) {
  // If Redis is not configured, allow all requests
  if (!redis) {
    return {
      success: true,
      remaining: config.limit,
      resetIn: config.interval
    }
  }

  const key = `rate-limit:${action}:${ip}`

  try {
    const [requests, _] = await redis
      .pipeline()
      .incr(key)
      .expire(key, config.interval)
      .exec()

    const remaining = config.limit - (requests as number)

    if (remaining < 0) {
      return {
        success: false,
        message: 'Too many requests',
        remaining: 0,
        resetIn: config.interval
      }
    }

    return {
      success: true,
      remaining,
      resetIn: config.interval
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // If Redis fails, default to allowing the request
    return {
      success: true,
      remaining: 1,
      resetIn: config.interval
    }
  }
}

export const rateLimitConfig = {
  auth: {
    signup: {
      interval: 3600, // 1 hour
      limit: 3 // 3 signups per hour
    },
    login: {
      interval: 300, // 5 minutes
      limit: 5 // 5 login attempts per 5 minutes
    },
    resetPassword: {
      interval: 3600, // 1 hour
      limit: 3 // 3 reset attempts per hour
    },
    verifyEmail: {
      interval: 3600, // 1 hour
      limit: 3 // 3 verification attempts per hour
    }
  }
}

export function getRateLimitResponse(result: Awaited<ReturnType<typeof rateLimit>>) {
  if (!result.success) {
    return NextResponse.json(
      {
        error: result.message,
        resetIn: result.resetIn
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.remaining.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetIn.toString()
        }
      }
    )
  }
  return null
} 