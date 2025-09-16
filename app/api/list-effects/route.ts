import { NextRequest, NextResponse } from 'next/server'
import { higgsfieldAPI } from '@/lib/higgsfield'

export async function GET(request: NextRequest) {
  try {
    const effects = await higgsfieldAPI.listEffects()
    return NextResponse.json(effects)
  } catch (error) {
    console.error('Error fetching effects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch effects' },
      { status: 500 }
    )
  }
}