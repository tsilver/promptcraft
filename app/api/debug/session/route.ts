import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('🔍 DEBUG API: Session retrieved:', session);
    
    return NextResponse.json({
      success: true,
      session: session,
      user: session?.user || null,
      roles: session?.user?.roles || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ DEBUG API: Error getting session:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
