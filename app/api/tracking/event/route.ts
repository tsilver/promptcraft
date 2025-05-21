import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BaseEvent } from '@/lib/tracking/types';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { events } = await request.json() as { events: BaseEvent[] };

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ message: 'No events provided' }, { status: 400 });
    }

    // Process and store events
    const processedEvents = events.map(event => ({
      id: event.id,
      userId: event.userId || 'anonymous',
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
      metadata: event.metadata || {},
      createdAt: new Date()
    }));

    // Store events in the database - use camelCase for model name (Prisma convention)
    await prisma.$transaction(
      processedEvents.map(event => 
        // @ts-ignore - Suppress TypeScript error for model name
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