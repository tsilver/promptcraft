import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  // Get the code from the URL
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // Redirect to the PromptCraft Analyzer page after successful sign-in
  return NextResponse.redirect(new URL('/promptcraft-analyzer', requestUrl.origin));
} 