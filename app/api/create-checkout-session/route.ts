import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, CREDIT_PACKAGES, CreditPackage } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { package: packageType } = await request.json()

    if (!packageType || !(packageType in CREDIT_PACKAGES)) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }

    const selectedPackage = CREDIT_PACKAGES[packageType as CreditPackage]

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${selectedPackage.credits} Credits`,
              description: `${selectedPackage.credits} video generation credits for RoomVision`,
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${request.headers.get('origin')}/dashboard?canceled=true`,
      metadata: {
        userId: session.user.id,
        credits: selectedPackage.credits.toString(),
        package: packageType,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}