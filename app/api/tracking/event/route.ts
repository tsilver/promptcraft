import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BaseEvent } from '@/lib/tracking/types';

// Anonymous user ID to use for events without a valid user ID
const ANONYMOUS_USER_ID = 'anon-tracking-user';

// Ensure anonymous user exists in the database
async function ensureAnonymousUser() {
  const anonUser = await prisma.user.findUnique({
    where: { id: ANONYMOUS_USER_ID }
  });
  
  if (!anonUser) {
    await prisma.user.create({
      data: {
        id: ANONYMOUS_USER_ID,
        email: 'anonymous@tracking.internal',
        name: 'Anonymous Tracking User'
      }
    });
  }
  
  return ANONYMOUS_USER_ID;
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { events } = await request.json() as { events: BaseEvent[] };

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ message: 'No events provided' }, { status: 400 });
    }
    
    // Ensure anonymous user exists
    const anonymousUserId = await ensureAnonymousUser();

    // Process and store events
    const processedEvents = events.map(event => ({
      id: event.id,
      userId: event.userId || anonymousUserId, // Use anonymous user ID if no user ID provided
      sessionId: event.sessionId || 'unknown',
      eventCategory: event.eventCategory.toString(),
      eventType: event.eventType.toString(),
      courseId: 'courseId' in event ? (event as any).courseId : undefined,
      moduleId: 'moduleId' in event ? (event as any).moduleId : undefined,
      lessonId: 'lessonId' in event ? (event as any).lessonId : undefined,
      courseVersion: 'courseVersion' in event ? (event as any).courseVersion : undefined,
      contentType: 'contentType' in event ? (event as any).contentType : undefined,
      source: event.clientInfo?.userAgent || 'unknown',
      userAgent: event.clientInfo?.userAgent,
      ipAddress: request.headers.get('x-forwarded-for') || undefined,
      metadata: {
        ...event.metadata || {},
        // Store the original session ID to help link events to users later
        trackingSessionId: event.sessionId,
        // Store anonymous flag to identify which events are from non-authenticated users
        isAnonymous: !event.userId
      },
      createdAt: new Date()
    }));

    // Store events in the database
    await prisma.$transaction(
      processedEvents.map(event => 
        // @ts-ignore - TrackingEvent is defined in schema.prisma but TypeScript doesn't recognize it
        prisma.trackingEvent.create({
          data: event
        })
      )
    );
    
    return NextResponse.json({
      message: `Successfully stored ${processedEvents.length} events`,
      success: true
    });
  } catch (error) {
    console.error('Error storing events:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 