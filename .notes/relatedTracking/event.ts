import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { BaseEvent } from './types';

/**
 * API handler for tracking events
 * 
 * This endpoint accepts a batch of events and stores them in the database.
 * It validates the user session and ensures all required fields are present.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate session
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get events from request body
    const { events } = req.body as { events: BaseEvent[] };

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ message: 'No events provided' });
    }

    // Check if we have a database connection
    const dbUrl = process.env.POSTGRES_URL;
    if (!dbUrl) {
      console.error('Database URL not set');
      return res.status(503).json({ 
        message: 'Database unavailable',
        error: 'POSTGRES_URL environment variable is not set'
      });
    }

    // Process and store events
    const processedEvents = events.map(event => ({
      ...event,
      // Ensure userId is set (either from event or from session)
      userId: event.userId || session.user.id,
      // Convert timestamp to a Date if it's a string
      timestamp: typeof event.timestamp === 'string' 
        ? new Date(event.timestamp) 
        : event.timestamp || new Date(),
      // Ensure metadata is proper JSON
      metadata: event.metadata || {}
    }));

    // Store events in batches
    const result = await prisma.$transaction(
      processedEvents.map(event => 
        prisma.TrackingEvent.create({
          data: {
            id: event.id,
            userId: event.userId!,
            sessionId: event.sessionId || 'unknown',
            eventCategory: event.eventCategory.toString(),
            eventType: event.eventType.toString(),
            courseId: 'courseId' in event ? event.courseId : undefined,
            moduleId: 'moduleId' in event ? event.moduleId : undefined,
            lessonId: 'lessonId' in event ? event.lessonId : undefined,
            courseVersion: 'courseVersion' in event ? event.courseVersion : undefined,
            contentType: 'contentType' in event ? event.contentType : undefined,
            source: event.clientInfo?.userAgent || 'unknown',
            userAgent: event.clientInfo?.userAgent,
            ipAddress: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || undefined,
            metadata: event.metadata
          }
        })
      )
    );
    
    return res.status(200).json({
      message: `Successfully stored ${result.length} events`,
      success: true
    });
  } catch (error) {
    console.error('Error storing events:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 