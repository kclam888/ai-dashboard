import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validatePassword } from '@/lib/validation'
import { compare, hash } from 'bcryptjs'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get connected accounts
    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      select: {
        provider: true,
        providerAccountId: true,
      }
    })

    return NextResponse.json({
      user: {
        ...user,
        accounts
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, currentPassword, newPassword, image } = body

    const updates: any = {}

    // Update name if provided
    if (name) {
      updates.name = name
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isValid = await compare(currentPassword, user.password!)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { error: 'New password does not meet requirements' },
          { status: 400 }
        )
      }

      updates.password = await hash(newPassword, 12)
    }

    // Update image if provided
    if (image) {
      updates.image = image
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updates
    })

    return NextResponse.json({
      user: {
        ...updatedUser,
        password: undefined
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 