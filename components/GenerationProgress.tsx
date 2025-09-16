'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface GenerationProgressProps {
  isGenerating: boolean
  onComplete?: (videoUrl: string) => void
  onError?: (error: string) => void
}

export function GenerationProgress({ isGenerating, onComplete, onError }: GenerationProgressProps) {
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('')

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0)
      setStage('')
      return
    }

    const stages = [
      'Analyzing your image...',
      'Processing room layout...',
      'Applying style effects...',
      'Generating video frames...',
      'Finalizing your video...',
    ]

    let currentStage = 0
    let currentProgress = 0

    const interval = setInterval(() => {
      if (currentProgress >= 100) {
        // Simulate completion after progress reaches 100%
        setTimeout(() => {
          onComplete?.('mock-video-url.mp4')
        }, 1000)
        clearInterval(interval)
        return
      }

      currentProgress += Math.random() * 15
      if (currentProgress > 100) currentProgress = 100

      const stageIndex = Math.floor((currentProgress / 100) * stages.length)
      if (stageIndex !== currentStage && stageIndex < stages.length) {
        currentStage = stageIndex
        setStage(stages[stageIndex])
      }

      setProgress(currentProgress)
    }, 800)

    return () => clearInterval(interval)
  }, [isGenerating, onComplete])

  if (!isGenerating) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Generating Your Video</h3>
            <p className="text-gray-400">
              Please wait while we create your personalized room transformation
            </p>
          </div>

          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-300">{stage}</p>
            <p className="text-xs text-gray-500">
              {Math.round(progress)}% complete
            </p>
          </div>

          <p className="text-xs text-gray-500">
            This usually takes 30-60 seconds. Please don't close this window.
          </p>
        </div>
      </div>
    </div>
  )
}