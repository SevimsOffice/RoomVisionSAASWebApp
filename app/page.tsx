'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from '@/components/ImageUpload'
import { EffectGrid } from '@/components/EffectGrid'
import { GenerationProgress } from '@/components/GenerationProgress'
import { CreditDisplay } from '@/components/CreditDisplay'
import { CreditPurchase } from '@/components/CreditPurchase'
import { VideoGallery } from '@/components/VideoGallery'
import { Sparkles, LogIn, User, Settings } from 'lucide-react'

interface UserData {
  credits: number
  videos: any[]
  transactions: any[]
}

export default function Home() {
  const { data: session, status } = useSession()
  const [imageUrl, setImageUrl] = useState<string>('')
  const [mode, setMode] = useState<string>('')
  const [roomType, setRoomType] = useState<string>('')
  const [style, setStyle] = useState<string>('')
  const [effect, setEffect] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCreditPurchase, setShowCreditPurchase] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState<'generate' | 'dashboard'>('generate')

  useEffect(() => {
    if (session?.user) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user-data')
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleGenerate = async () => {
    if (!imageUrl || !mode || !roomType || !style || !effect) {
      return
    }

    // If user is not signed in, prompt them to sign in
    if (!session) {
      signIn()
      return
    }

    if (!userData || userData.credits <= 0) {
      setShowCreditPurchase(true)
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          mode,
          roomType,
          style,
          effect,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh user data to update credits and videos
        await fetchUserData()
        // Switch to dashboard to show the new video
        setActiveTab('dashboard')
      } else {
        alert(data.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert('Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePurchaseCredits = async (packageId: string) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ package: packageId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  const isFormValid = imageUrl && mode && roomType && style && effect

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">RoomVision</h1>
            </div>

            <div className="flex items-center gap-4">
              {session && userData && (
                <CreditDisplay
                  credits={userData.credits}
                  onBuyCredits={() => setShowCreditPurchase(true)}
                />
              )}

              {session ? (
                <div className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{session.user?.name || session.user?.email}</span>
                </div>
              ) : (
                <Button
                  onClick={() => signIn()}
                  variant="outline"
                  className="border-gray-600 hover:border-gray-500 text-white gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button
              variant={activeTab === 'generate' ? 'default' : 'outline'}
              onClick={() => setActiveTab('generate')}
              className={activeTab === 'generate' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 hover:border-gray-500'}
            >
              Generate Video
            </Button>
            {session && (
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveTab('dashboard')}
                className={activeTab === 'dashboard' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 hover:border-gray-500'}
              >
                My Dashboard
              </Button>
            )}
          </div>

          {activeTab === 'generate' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Upload Your Image</h2>
                  <ImageUpload
                    onImageSelect={setImageUrl}
                    selectedImage={imageUrl}
                    disabled={isGenerating}
                  />
                </div>

                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Configuration</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Mode</label>
                      <Select value={mode} onValueChange={setMode} disabled={isGenerating}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="room-to-furniture">Room → Furniture</SelectItem>
                          <SelectItem value="furniture-to-room">Furniture → Room</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Room Type</label>
                      <Select value={roomType} onValueChange={setRoomType} disabled={isGenerating}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="living-room">Living Room</SelectItem>
                          <SelectItem value="bedroom">Bedroom</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="bathroom">Bathroom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Style</label>
                    <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="futuristic">Futuristic</SelectItem>
                        <SelectItem value="bohemian">Bohemian</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="scandinavian">Scandinavian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!isFormValid || isGenerating || (session && userData && userData.credits <= 0)}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : !session ? (
                      <>Generate Video (Sign in required)</>
                    ) : (session && userData && userData.credits <= 0) ? (
                      <>No Credits - Buy More</>
                    ) : (
                      <>Generate Video ({session && userData ? userData.credits : '?'} credits)</>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                <EffectGrid
                  onEffectSelect={setEffect}
                  selectedEffect={effect}
                  disabled={isGenerating}
                />
              </div>
            </div>
          ) : session ? (
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
              {userData && <VideoGallery videos={userData.videos} />}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 text-center">
              <p className="text-gray-400">Please sign in to view your dashboard</p>
            </div>
          )}
        </div>
      </main>

      <GenerationProgress
        isGenerating={isGenerating}
        onComplete={() => {
          setIsGenerating(false)
          fetchUserData()
          setActiveTab('dashboard')
        }}
        onError={() => setIsGenerating(false)}
      />

      <CreditPurchase
        isOpen={showCreditPurchase}
        onClose={() => setShowCreditPurchase(false)}
        onPurchase={handlePurchaseCredits}
      />
    </div>
  )
}