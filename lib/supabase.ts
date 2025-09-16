import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://vyftnqacjueqelgpleph.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

if (!supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)