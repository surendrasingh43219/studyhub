import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = 'https://msudsyupqkqfzokrqjep.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zdWRzeXVwcWtxZnpva3JxamVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MDgzMTgsImV4cCI6MjEwOTE4NDMxOH0.my3wgUs6kBiQ8gzuBnE_dsoM1JMamVPDhkZDCaZ-g_I'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
  return createBrowserClient(url, key)
}
