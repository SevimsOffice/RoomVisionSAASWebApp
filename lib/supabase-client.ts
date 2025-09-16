'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vyftnqacjueqelgpleph.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZnRucWFjanVlcWVsZ3BsZXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NjI5MjMsImV4cCI6MjA3MzIzODkyM30.w6ctZ6kSiDVswiYcv81eUyn3HwX68pqyMoOxjt_eKH4'

export const supabase = createClient(supabaseUrl, supabaseKey)