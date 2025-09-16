'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void
  selectedImage: string | null
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, selectedImage, disabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setIsUploading(true)
    
    // In a real app, you'd upload to your storage service (AWS S3, Cloudinary, etc.)
    // For demo purposes, we'll create a local URL
    try {
      const imageUrl = URL.createObjectURL(file)
      onImageSelect(imageUrl)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Error processing image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {selectedImage ? (
        <div className="relative group">
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onImageSelect('')}
                disabled={disabled || isUploading}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            "hover:border-blue-500 hover:bg-blue-500/5",
            isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-600",
            disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            {isUploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            ) : (
              <div className="p-4 rounded-full bg-gray-800">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {isUploading ? 'Processing...' : 'Upload an image'}
              </h3>
              <p className="text-gray-400">
                {isUploading 
                  ? 'Please wait while we process your image'
                  : 'Drag and drop your image here, or click to browse'
                }
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, WEBP files
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}