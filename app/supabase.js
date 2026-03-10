import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ddvburiznaggmfwxxrlh.supabase.co'
const supabaseKey = 'sb_publishable_jC4LmOblzqeqV8_o8enBPw_M8KeUAgr'

export const supabase = createClient(supabaseUrl, supabaseKey)