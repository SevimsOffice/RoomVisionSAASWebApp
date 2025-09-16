import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export const CREDIT_PACKAGES = {
  small: {
    credits: 10,
    price: 900, // $9.00 in cents
    priceId: 'price_small_credits', // You'll need to create this in Stripe Dashboard
  },
  medium: {
    credits: 30,
    price: 1900, // $19.00 in cents
    priceId: 'price_medium_credits',
  },
  large: {
    credits: 100,
    price: 2900, // $29.00 in cents
    priceId: 'price_large_credits',
  },
} as const

export type CreditPackage = keyof typeof CREDIT_PACKAGES