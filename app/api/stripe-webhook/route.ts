import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const { userId, credits } = session.metadata || {}

    if (!userId || !credits) {
      console.error('Missing metadata in checkout session')
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    try {
      // Add credits to user account
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: parseInt(credits, 10),
          },
        },
      })

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          stripePaymentId: session.payment_intent as string,
          amount: session.amount_total || 0,
          credits: parseInt(credits, 10),
          status: 'completed',
        },
      })

      console.log(`Added ${credits} credits to user ${userId}`)
    } catch (error) {
      console.error('Error updating user credits:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}