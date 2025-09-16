'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { VideoGallery } from '@/components/VideoGallery'
import { CreditDisplay } from '@/components/CreditDisplay'
import { CreditPurchase } from '@/components/CreditPurchase'
import { Button } from '@/components/ui/button'
import { Receipt, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface UserData {
  credits: number
  videos: any[]
  transactions: any[]
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showCreditPurchase, setShowCreditPurchase] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/')
    }

    if (session?.user) {
      fetchUserData()
    }
  }, [session, status])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user-data')
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
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

  const openCustomerPortal = async () => {
    try {
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (error) {
      console.error('Error opening customer portal:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-gray-600 hover:border-gray-500">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Generator
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={openCustomerPortal}
                variant="outline"
                className="border-gray-600 hover:border-gray-500 gap-2"
              >
                <Receipt className="w-4 h-4" />
                Billing History
              </Button>
              
              {userData && (
                <CreditDisplay
                  credits={userData.credits}
                  onBuyCredits={() => setShowCreditPurchase(true)}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Account Overview</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{session?.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-white">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Videos Generated</p>
                    <p className="text-white">{userData?.videos?.length || 0}</p>
                  </div>
                </div>
              </div>

              {userData?.transactions && userData.transactions.length > 0 && (
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Recent Purchases</h2>
                  <div className="space-y-3">
                    {userData.transactions.slice(0, 3).map((transaction: any) => (
                      <div key={transaction.id} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-white">{transaction.credits} credits</p>
                          <p className="text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-green-400">
                          ${(transaction.amount / 100).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={openCustomerPortal}
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-gray-600 hover:border-gray-500"
                  >
                    View All Transactions
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
                {userData && <VideoGallery videos={userData.videos} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreditPurchase
        isOpen={showCreditPurchase}
        onClose={() => setShowCreditPurchase(false)}
        onPurchase={handlePurchaseCredits}
      />
    </div>
  )
}