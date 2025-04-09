import { createClient } from '@supabase/supabase-js'

export default async function createSupabaseAdminAuthClient(){
    return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
    })
}
