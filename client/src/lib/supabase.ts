import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! as string

let supabaseKey: string;

supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY! as string

let supabase: SupabaseClient;

try {
    supabase = createClient(supabaseUrl, supabaseKey)
} catch (error: any) {
    console.error(error)
}

export { supabase }