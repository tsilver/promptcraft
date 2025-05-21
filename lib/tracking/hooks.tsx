'use client';

import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
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
  const { user } = useAuth();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [manager, setManager] = useState<EventManager | null>(null);
  const [pathname, setPathname] = useState<string>('');
  
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
  
  // Track page views
  useEffect(() => {
    if (!manager || !sessionId || typeof window === 'undefined') return;
    
    // Get the current path
    const currentPath = window.location.pathname;
    
    // Don't track if it's the same path or an API route
    if (currentPath === pathname || currentPath.startsWith('/api/')) return;
    
    // Update pathname
    setPathname(currentPath);
    
    // Parse route for course/module/lesson identifiers
    const routeParts = currentPath.split('/').filter(Boolean);
    const isCourse = routeParts[0] === 'course';
    const courseId = isCourse ? routeParts[1] : undefined;
    const moduleId = isCourse && routeParts.length > 2 ? routeParts[2] : undefined;
    const lessonId = isCourse && routeParts.length > 3 ? routeParts[3] : undefined;
    
    // Use CourseEvent type for the appropriate event structure
    manager.trackEvent(
      EventType.PAGE_VIEW,
      {
        eventCategory: EventCategory.NAVIGATION,
        userId: user?.id,
        sessionId,
        ...(courseId && { courseId }),
        ...(moduleId && { moduleId }),
        ...(lessonId && { lessonId }),
        metadata: {
          path: currentPath,
          referrer: document.referrer,
          query: {} // In Next.js App Router, you'd need a different approach here
        }
      }
    );
  }, [manager, pathname, sessionId, user]);
  
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
        userId: user?.id,
        sessionId
      }
    );
  }, [manager, user, sessionId]);
  
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
        userId: user?.id,
        sessionId
      }
    );
  }, [manager, user, sessionId]);
  
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
        userId: user?.id,
        sessionId
      }
    );
  }, [manager, user, sessionId]);
  
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
        userId: user?.id,
        sessionId
      }
    );
  }, [manager, user, sessionId]);
  
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