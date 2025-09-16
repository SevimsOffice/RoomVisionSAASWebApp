const HIGGSFIELD_API_KEY = process.env.HIGGSFIELD_API_KEY
const HIGGSFIELD_BASE_URL = process.env.HIGGSFIELD_BASE_URL || 'https://api.higgsfield.ai'

if (!HIGGSFIELD_API_KEY) {
  console.warn('HIGGSFIELD_API_KEY is not set')
}

export interface Effect {
  id: string
  name: string
  description: string
  previewUrl?: string
  category: string
}

export interface GenerationRequest {
  imageUrl: string
  mode: 'room-to-furniture' | 'furniture-to-room'
  roomType: string
  style: string
  effect: string
}

export interface GenerationResponse {
  id: string
  videoUrl: string
  thumbnailUrl: string
  status: 'processing' | 'completed' | 'failed'
}

class HiggsfieldAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = HIGGSFIELD_API_KEY || ''
    this.baseUrl = HIGGSFIELD_BASE_URL
  }

  async listEffects(): Promise<Effect[]> {
    try {
      if (!this.apiKey) {
        // Return mock effects for development
        return [
          { id: 'classic-warm', name: 'Classic Warm', description: 'Warm, classic styling', category: 'classic' },
          { id: 'modern-minimal', name: 'Modern Minimal', description: 'Clean, minimal modern look', category: 'modern' },
          { id: 'futuristic-neon', name: 'Futuristic Neon', description: 'High-tech futuristic styling', category: 'futuristic' },
          { id: 'bohemian-cozy', name: 'Bohemian Cozy', description: 'Warm, eclectic bohemian style', category: 'bohemian' },
          { id: 'industrial-raw', name: 'Industrial Raw', description: 'Raw industrial aesthetic', category: 'industrial' },
          { id: 'scandinavian-light', name: 'Scandinavian Light', description: 'Light, airy Scandinavian design', category: 'scandinavian' },
        ]
      }

      const response = await fetch(`${this.baseUrl}/effects`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching effects:', error)
      throw error
    }
  }

  async generateVideo(request: GenerationRequest): Promise<GenerationResponse> {
    try {
      if (!this.apiKey) {
        // Return mock response for development
        return {
          id: `mock_${Date.now()}`,
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnailUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300',
          status: 'completed',
        }
      }

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error generating video:', error)
      throw error
    }
  }

  async getGenerationStatus(id: string): Promise<GenerationResponse> {
    try {
      if (!this.apiKey) {
        return {
          id,
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnailUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300',
          status: 'completed',
        }
      }

      const response = await fetch(`${this.baseUrl}/generate/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error checking generation status:', error)
      throw error
    }
  }
}

export const higgsfieldAPI = new HiggsfieldAPI()