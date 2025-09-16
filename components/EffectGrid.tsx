'use client'

import { useState, useEffect } from 'react'
import { Play, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Effect {
  id: string
  name: string
  description: string
  previewUrl?: string
  category: string
}

interface EffectGridProps {
  onEffectSelect: (effect: string) => void
  selectedEffect: string | null
  disabled?: boolean
}

export function EffectGrid({ onEffectSelect, selectedEffect, disabled }: EffectGridProps) {
  const [effects, setEffects] = useState<Effect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEffects()
  }, [])

  const fetchEffects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/list-effects')
      
      if (!response.ok) {
        throw new Error('Failed to fetch effects')
      }
      
      const data = await response.json()
      setEffects(data)
    } catch (err) {
      console.error('Error fetching effects:', err)
      setError('Failed to load effects')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading effects...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-red-400">{error}</p>
        <Button
          variant="outline"
          onClick={fetchEffects}
          className="border-gray-600 hover:border-gray-500"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Choose an Effect</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {effects.map((effect) => (
          <div
            key={effect.id}
            className={cn(
              "relative group cursor-pointer rounded-lg overflow-hidden bg-gray-800 border-2 transition-all",
              selectedEffect === effect.id
                ? "border-blue-500 ring-2 ring-blue-500/20"
                : "border-gray-700 hover:border-gray-600",
              disabled ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={() => !disabled && onEffectSelect(effect.id)}
          >
            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
              {effect.previewUrl ? (
                <video
                  src={effect.previewUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div className="flex items-center justify-center">
                  <Play className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              {selectedEffect === effect.id && (
                <div className="absolute inset-0 bg-blue-500/20 border border-blue-500 rounded-lg" />
              )}
            </div>
            
            <div className="p-3">
              <h4 className="font-medium text-white text-sm">{effect.name}</h4>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                {effect.description}
              </p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 capitalize">
                  {effect.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}