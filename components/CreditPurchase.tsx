'use client'

import { useState } from 'react'
import { Coins, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const PACKAGES = [
  {
    id: 'small',
    name: 'Starter Pack',
    credits: 10,
    price: '$9',
    originalPrice: '$10',
    popular: false,
    features: ['10 video generations', 'Basic effects', 'HD quality'],
  },
  {
    id: 'medium',
    name: 'Popular Pack',
    credits: 30,
    price: '$19',
    originalPrice: '$30',
    popular: true,
    features: ['30 video generations', 'All effects', 'HD quality', 'Priority processing'],
  },
  {
    id: 'large',
    name: 'Pro Pack',
    credits: 100,
    price: '$29',
    originalPrice: '$100',
    popular: false,
    features: ['100 video generations', 'All effects', '4K quality', 'Priority processing', 'Commercial license'],
  },
]

interface CreditPurchaseProps {
  onPurchase: (packageId: string) => void
  isOpen: boolean
  onClose: () => void
}

export function CreditPurchase({ onPurchase, isOpen, onClose }: CreditPurchaseProps) {
  const [loading, setLoading] = useState<string | null>(null)

  if (!isOpen) return null

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId)
    try {
      await onPurchase(packageId)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Credits</h2>
              <p className="text-gray-400 mt-1">
                Select a credit package to continue generating amazing videos
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-lg border-2 p-6 ${
                  pkg.popular
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Coins className="w-12 h-12 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-white">{pkg.price}</span>
                      <span className="text-lg text-gray-400 line-through">{pkg.originalPrice}</span>
                    </div>
                    <p className="text-gray-400">{pkg.credits} credits</p>
                    <p className="text-sm text-green-400">
                      Save {Math.round((1 - parseFloat(pkg.price.slice(1)) / parseFloat(pkg.originalPrice.slice(1))) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading !== null}
                  className={`w-full ${
                    pkg.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {loading === pkg.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Coins className="w-4 h-4 mr-2" />
                  )}
                  {loading === pkg.id ? 'Processing...' : `Buy ${pkg.credits} Credits`}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-white">Payment Information</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>• Secure payment processing powered by Stripe</p>
                  <p>• Credits are added to your account immediately after purchase</p>
                  <p>• Credits never expire and can be used anytime</p>
                  <p>• Need help? Contact support at hello@roomvision.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}