'use client'

import { useState } from 'react'
import { Download, Eye, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Video {
  id: string
  videoUrl: string
  thumbnailUrl?: string
  mode: string
  roomType: string
  style: string
  effect: string
  createdAt: string
  status: string
}

interface VideoGalleryProps {
  videos: Video[]
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const handleDownload = async (video: Video) => {
    try {
      const response = await fetch(video.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `roomvision-${video.id}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No videos yet</h3>
          <p className="text-sm">Your generated videos will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Your Videos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group bg-gray-900 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
          >
            <div className="relative aspect-video bg-gray-800">
              {video.status === 'completed' ? (
                <video
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  className="w-full h-full object-cover cursor-pointer"
                  controls
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-400">
                      {video.status === 'processing' ? 'Processing...' : 'Failed'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  <Tag className="w-3 h-3 mr-1" />
                  {video.effect.replace('-', ' ')}
                </Badge>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDistanceToNow(new Date(video.createdAt))} ago
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">
                  {video.mode === 'room-to-furniture' ? '🏠→🪑' : '🪑→🏠'} {video.roomType}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {video.style} Style
                </p>
              </div>
              
              {video.status === 'completed' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedVideo(video)}
                    className="flex-1 border-gray-600 hover:border-gray-500"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(video)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="bg-gray-900 rounded-lg border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {selectedVideo.mode === 'room-to-furniture' ? 'Room to Furniture' : 'Furniture to Room'}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
              
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.thumbnailUrl}
                className="w-full rounded-lg"
                controls
                autoPlay
              />
              
              <div className="mt-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">
                    Style: <span className="text-white capitalize">{selectedVideo.style}</span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Effect: <span className="text-white">{selectedVideo.effect.replace('-', ' ')}</span>
                  </p>
                </div>
                <Button
                  onClick={() => handleDownload(selectedVideo)}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}