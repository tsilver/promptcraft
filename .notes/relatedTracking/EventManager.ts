import { v4 as uuidv4 } from 'uuid';
import { BaseEvent, EventCategory, EventType } from './types';

export interface EventManagerOptions {
  batchSize?: number;
  flushInterval?: number;
  debug?: boolean;
  endpoint?: string;
}

/**
 * EventManager handles the collection, batching, and persistence of tracking events.
 * It implements the Singleton pattern to ensure only one instance exists across the application.
 */
export class EventManager {
  private static instance: EventManager;
  private eventQueue: BaseEvent[] = [];
  private readonly batchSize: number;
  private readonly flushInterval: number;
  private readonly debug: boolean;
  private readonly endpoint: string;
  private flushTimeoutId: NodeJS.Timeout | null = null;
  private isProcessing = false;

  private constructor(options: EventManagerOptions = {}) {
    this.batchSize = options.batchSize || 10;
    this.flushInterval = options.flushInterval || 5000; // 5 seconds
    this.debug = options.debug || false;
    this.endpoint = options.endpoint || '/api/tracking/event';
    this.startFlushInterval();
  }

  /**
   * Get the singleton instance of EventManager
   */
  public static getInstance(options?: EventManagerOptions): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager(options);
    }
    return EventManager.instance;
  }

  /**
   * Track a new event
   * @param eventType The type of event
   * @param eventData The event data
   */
  public async trackEvent(
    eventType: EventType, 
    eventData: Omit<BaseEvent, 'id' | 'timestamp' | 'eventType'>
  ): Promise<void> {
    const event: BaseEvent = {
      id: uuidv4(),
      timestamp: new Date(),
      eventType,
      ...eventData
    };

    await this.processAndQueueEvent(event);
  }

  /**
   * Process and enqueue an event
   */
  private async processAndQueueEvent(event: BaseEvent): Promise<void> {
    const enrichedEvent = await this.enrichEvent(event);
    
    if (this.debug) {
      console.log('[EventTracking] Event tracked:', enrichedEvent);
    }
    
    this.eventQueue.push(enrichedEvent);
    
    if (this.eventQueue.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  /**
   * Enrich an event with additional data
   */
  private async enrichEvent(event: BaseEvent): Promise<BaseEvent> {
    // Add environment info, browser details, etc.
    return {
      ...event,
      clientInfo: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        language: typeof window !== 'undefined' ? window.navigator.language : 'unknown',
        viewport: typeof window !== 'undefined' ? {
          width: window.innerWidth,
          height: window.innerHeight
        } : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined
      }
    };
  }

  /**
   * Start the interval for flushing events periodically
   */
  private startFlushInterval(): void {
    this.flushTimeoutId = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flushEvents();
      }
    }, this.flushInterval);
  }

  /**
   * Flush all queued events to the server
   */
  public async flushEvents(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    try {
      await this.persistEvents(events);
      
      if (this.debug) {
        console.log(`[EventTracking] Flushed ${events.length} events`);
      }
    } catch (error) {
      // Requeue failed events
      this.eventQueue = [...events, ...this.eventQueue];
      console.error('[EventTracking] Error flushing events:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Persist events to the server
   */
  private async persistEvents(events: BaseEvent[]): Promise<void> {
    if (typeof window === 'undefined') {
      // Don't try to persist events during SSR
      return;
    }
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('[EventTracking] Failed to persist events:', error);
      throw error;
    }
  }

  /**
   * Clean up resources when the manager is no longer needed
   */
  public dispose(): void {
    if (this.flushTimeoutId) {
      clearInterval(this.flushTimeoutId);
      this.flushTimeoutId = null;
    }
    
    if (this.eventQueue.length > 0) {
      this.flushEvents();
    }
  }
} 