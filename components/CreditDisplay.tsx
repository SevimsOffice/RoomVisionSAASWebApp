'use client'

import { Coins, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CreditDisplayProps {
  credits: number
  onBuyCredits: () => void
}

export function CreditDisplay({ credits, onBuyCredits }: CreditDisplayProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2">
        <Coins className="w-5 h-5 text-yellow-500" />
        <span className="text-white font-medium">{credits} Credits</span>
      </div>
      
      {credits <= 5 && (
        <div className="text-sm text-orange-400">
          {credits === 0 ? 'No credits remaining' : 'Running low!'}
        </div>
      )}
      
      <Button
        size="sm"
        onClick={onBuyCredits}
        className="ml-auto gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        Buy Credits
      </Button>
    </div>
  )
}