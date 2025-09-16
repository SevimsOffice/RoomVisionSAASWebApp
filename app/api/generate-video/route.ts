import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { higgsfieldAPI } from '@/lib/higgsfield'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageUrl, mode, roomType, style, effect } = await request.json()

    // Check if user has credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Generate video using Higgsfield API
    const generationRequest = {
      imageUrl,
      mode: mode as 'room-to-furniture' | 'furniture-to-room',
      roomType,
      style,
      effect,
    }

    const result = await higgsfieldAPI.generateVideo(generationRequest)

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        videoUrl: result.videoUrl,
        thumbnailUrl: result.thumbnailUrl || '',
        mode,
        roomType,
        style,
        effect,
        originalImageUrl: imageUrl,
        status: result.status,
      },
    })

    // Deduct 1 credit from user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    })

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        status: video.status,
      },
    })
  } catch (error) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}