import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    // Get the authenticated user from the session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ 
        message: 'Authentication required' 
      }, { status: 401 });
    }

    // Parse the request body
    const { anonymousId } = await request.json();

    if (!anonymousId) {
      return NextResponse.json({ 
        message: 'Anonymous ID is required' 
      }, { status: 400 });
    }

    const userId = session.user.id;

    // Find or create an anonymous tracking profile
    // @ts-ignore - Using Prisma model defined in schema but TypeScript doesn't recognize it yet
    const existingProfile = await prisma.anonymousTrackingProfile.findUnique({
      where: { anonymousId }
    });

    if (existingProfile) {
      // Update existing profile
      // @ts-ignore - Using Prisma model defined in schema but TypeScript doesn't recognize it yet
      await prisma.anonymousTrackingProfile.update({
        where: { id: existingProfile.id },
        data: {
          userId,
          lastSeen: new Date()
        }
      });
    } else {
      // Create new profile
      // @ts-ignore - Using Prisma model defined in schema but TypeScript doesn't recognize it yet
      await prisma.anonymousTrackingProfile.create({
        data: {
          anonymousId,
          userId,
          metadata: {
            userAgent: request.headers.get('user-agent') || 'unknown',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
          }
        }
      });
    }

    // For Prisma's metadata JSON field, we need to construct the query differently
    const metadataQuery = Prisma.sql`metadata::jsonb @> '{"anonymousId":"${anonymousId}"}'::jsonb`;

    // Optional: update anonymous tracking events to link them to this user
    // @ts-ignore - Using raw SQL for JSON query
    await prisma.$executeRaw`
      UPDATE "TrackingEvent"
      SET "userId" = ${userId}
      WHERE "userId" = 'anon-tracking-user'
      AND ${metadataQuery}
    `;

    return NextResponse.json({
      message: 'Anonymous tracking ID registered with user account',
      success: true
    });
  } catch (error) {
    console.error('Error registering anonymous ID:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 