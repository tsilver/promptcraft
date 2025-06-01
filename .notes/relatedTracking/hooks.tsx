import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { EventManager } from './EventManager';
import { 
  EventType, 
  EventCategory, 
  BaseEvent, 
  EventTrackingConfig,
  CourseEvent,
  LLMInteractionEvent,
  ProficiencyEvent
} from './types';

// Context for event tracking
interface EventTrackingContextType {
  trackEvent: (
    eventType: EventType, 
    eventData: Omit<BaseEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => Promise<void>;
  trackCourseEvent: (
    eventType: EventType,
    eventData: Omit<CourseEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => Promise<void>;
  trackLLMEvent: (
    eventType: EventType,
    eventData: Omit<LLMInteractionEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => Promise<void>;
  trackProficiencyEvent: (
    eventType: EventType,
    eventData: Omit<ProficiencyEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => Promise<void>;
  setSessionId: (sessionId: string) => void;
}

const EventTrackingContext = createContext<EventTrackingContextType | undefined>(undefined);

// Generate a session ID if one doesn't exist
const generateSessionId = (): string => {
  if (typeof window === 'undefined') return 'server';
  
  const existingSessionId = localStorage.getItem('tracking_session_id');
  if (existingSessionId) return existingSessionId;
  
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem('tracking_session_id', newSessionId);
  return newSessionId;
};

// Provider component for event tracking
export interface EventTrackingProviderProps {
  children: ReactNode;
  config?: EventTrackingConfig;
}

export const EventTrackingProvider: React.FC<EventTrackingProviderProps> = ({ 
  children, 
  config 
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [manager, setManager] = useState<EventManager | null>(null);
  
  // Initialize event manager and session ID
  useEffect(() => {
    const eventManager = EventManager.getInstance(config);
    setManager(eventManager);
    setSessionId(generateSessionId());
    
    // Clean up when component unmounts
    return () => {
      eventManager.dispose();
    };
  }, [config]);
  
  // Track route changes
  useEffect(() => {
    if (!manager || !sessionId) return;
    
    const handleRouteChange = (url: string) => {
      // Don't track API routes or initial load
      if (url.startsWith('/api/') || url === router.asPath) return;
      
      const routeParts = url.split('/').filter(Boolean);
      const isCourse = routeParts[0] === 'course';
      const courseId = isCourse ? routeParts[1] : undefined;
      const moduleId = isCourse && routeParts.length > 2 ? routeParts[2] : undefined;
      const lessonId = isCourse && routeParts.length > 3 ? routeParts[3] : undefined;
      
      manager.trackEvent(
        EventType.PAGE_VIEW,
        {
          eventCategory: EventCategory.NAVIGATION,
          userId: session?.user?.id,
          sessionId,
          courseId,
          moduleId,
          lessonId,
          metadata: {
            path: url,
            previousPath: router.asPath,
            query: router.query
          }
        }
      );
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [manager, router, sessionId, session]);
  
  // Track generic events
  const trackEvent = useCallback(async (
    eventType: EventType,
    eventData: Omit<BaseEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => {
    if (!manager) return;
    
    await manager.trackEvent(
      eventType,
      {
        ...eventData,
        userId: session?.user?.id,
        sessionId
      }
    );
  }, [manager, session, sessionId]);
  
  // Track course-specific events
  const trackCourseEvent = useCallback(async (
    eventType: EventType,
    eventData: Omit<CourseEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => {
    if (!manager) return;
    
    await manager.trackEvent(
      eventType,
      {
        ...eventData,
        userId: session?.user?.id,
        sessionId
      }
    );
  }, [manager, session, sessionId]);
  
  // Track LLM interaction events
  const trackLLMEvent = useCallback(async (
    eventType: EventType,
    eventData: Omit<LLMInteractionEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => {
    if (!manager) return;
    
    await manager.trackEvent(
      eventType,
      {
        ...eventData,
        eventCategory: EventCategory.LLM_INTERACTION,
        userId: session?.user?.id,
        sessionId
      }
    );
  }, [manager, session, sessionId]);
  
  // Track proficiency assessment events
  const trackProficiencyEvent = useCallback(async (
    eventType: EventType,
    eventData: Omit<ProficiencyEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => {
    if (!manager) return;
    
    await manager.trackEvent(
      eventType,
      {
        ...eventData,
        eventCategory: EventCategory.PROFICIENCY,
        userId: session?.user?.id,
        sessionId
      }
    );
  }, [manager, session, sessionId]);
  
  return (
    <EventTrackingContext.Provider 
      value={{ 
        trackEvent, 
        trackCourseEvent, 
        trackLLMEvent, 
        trackProficiencyEvent,
        setSessionId
      }}
    >
      {children}
    </EventTrackingContext.Provider>
  );
};

// Hook for using event tracking in components
export interface UseEventTrackingOptions {
  debug?: boolean;
}

export function useEventTracking(options?: UseEventTrackingOptions) {
  const context = useContext(EventTrackingContext);
  
  if (!context) {
    throw new Error('useEventTracking must be used within an EventTrackingProvider');
  }
  
  const debug = options?.debug ?? false;
  
  // Wrap track functions with debug logging
  const trackEvent = useCallback(async (
    eventType: EventType,
    eventData: Omit<BaseEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => {
    if (debug) {
      console.log(`[EventTracking] Tracking event: ${eventType}`, eventData);
    }
    return context.trackEvent(eventType, eventData);
  }, [context.trackEvent, debug]);
  
  const trackCourseEvent = useCallback(async (
    eventType: EventType,
    eventData: Omit<CourseEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => {
    if (debug) {
      console.log(`[EventTracking] Tracking course event: ${eventType}`, eventData);
    }
    return context.trackCourseEvent(eventType, eventData);
  }, [context.trackCourseEvent, debug]);
  
  const trackLLMEvent = useCallback(async (
    eventType: EventType,
    eventData: Omit<LLMInteractionEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => {
    if (debug) {
      console.log(`[EventTracking] Tracking LLM event: ${eventType}`, eventData);
    }
    return context.trackLLMEvent(eventType, eventData);
  }, [context.trackLLMEvent, debug]);
  
  const trackProficiencyEvent = useCallback(async (
    eventType: EventType,
    eventData: Omit<ProficiencyEvent, 'id' | 'timestamp' | 'eventType' | 'userId' | 'sessionId'>
  ) => {
    if (debug) {
      console.log(`[EventTracking] Tracking proficiency event: ${eventType}`, eventData);
    }
    return context.trackProficiencyEvent(eventType, eventData);
  }, [context.trackProficiencyEvent, debug]);
  
  return {
    trackEvent,
    trackCourseEvent,
    trackLLMEvent,
    trackProficiencyEvent,
    setSessionId: context.setSessionId
  };
} 