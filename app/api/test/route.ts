import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';

export async function GET() {
  try {
    const result = await generateContent('Write a short hello world message in markdown format');
    return NextResponse.json({ 
      success: true, 
      result,
      apiKeyExists: !!process.env.GEMINI_KEY,
      apiUrlExists: !!process.env.GOOGLE_AI_API_URL
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message,
      apiKeyExists: !!process.env.GEMINI_KEY,
      apiUrlExists: !!process.env.GOOGLE_AI_API_URL
    }, { status: 500 });
  }
} 