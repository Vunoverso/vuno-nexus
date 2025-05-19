// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Valores definidos em .env.local (não comitar!):
// NEXT_PUBLIC_SUPABASE_URL=https://oxewdquzwwcvgxdwjjqe.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…ChP5bvu3xTI

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
