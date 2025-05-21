# Event Tracking System

This document explains how to use the event tracking system within the application.

## Overview

The event tracking system provides standardized methods for capturing user interactions, LLM interactions, and proficiency assessments across the application. It follows a consistent pattern to ensure data quality and reliability.

## Architecture

```
Client Component → EventTracking Hook → EventManager → Database
```

The system consists of:
- **Event Types**: Standardized event structures with type safety
- **Event Manager**: Handles queueing, batching, and persistence
- **React Hooks**: Easy integration into components
- **API Endpoint**: Stores events in the database

## Getting Started

To use event tracking in your components, follow these steps:

1. Import the tracking hook and event types:
```tsx
import { useEventTracking } from '@/lib/tracking/hooks';
import { EventType, EventCategory } from '@/lib/tracking/types';
```

2. Use the hook in your component:
```tsx
const { trackEvent, trackLLMEvent } = useEventTracking({ debug: true });
```

3. Track events at the appropriate moments:
```tsx
// For general events
trackEvent(EventType.RESOURCE_CLICK, {
  eventCategory: EventCategory.INTERACTION,
  metadata: {
    resourceId: 'resource-123',
    resourceType: 'pdf',
    source: 'sidebar'
  }
});

// For LLM interactions
trackLLMEvent(EventType.LLM_PROMPT, {
  eventCategory: EventCategory.LLM_INTERACTION,
  prompt: promptText,
  metadata: {
    action: 'execute',
    source: 'prompt-input'
  }
});
```

## Event Categories

The system supports the following event categories:

- `NAVIGATION`: Page views, module/lesson navigation
- `INTERACTION`: User interactions with UI elements
- `ASSESSMENT`: User assessment submissions
- `LLM_INTERACTION`: Interactions with AI models
- `PROFICIENCY`: Skill assessment and proficiency tracking
- `SYSTEM`: System-level events

## Event Types

Common event types include:

### Navigation Events
- `PAGE_VIEW`: User views a page
- `MODULE_START`: User starts a module
- `LESSON_START`: User starts a lesson

### Interaction Events
- `RESOURCE_CLICK`: User clicks a resource
- `VIDEO_PLAY`: User plays a video
- `VIDEO_PAUSE`: User pauses a video

### LLM Interaction Events
- `LLM_PROMPT`: User submits a prompt
- `LLM_RESPONSE`: AI responds to a prompt
- `LLM_EVALUATION`: AI evaluates a prompt

## Best Practices

1. **Track Meaningful Events**: Only track events that provide actionable insights
2. **Include Context**: Always include relevant context in the metadata
3. **Consistent Naming**: Use consistent property names in metadata
4. **Error Handling**: Tracking failures should not disrupt the user experience
5. **Debug Mode**: Use `{ debug: true }` during development to see events logged to the console

## Example: Tracking Prompt Evaluations

```tsx
const handleEvaluate = async () => {
  if (!promptText.trim()) return;
  
  // Track prompt evaluation event
  trackLLMEvent(EventType.LLM_EVALUATION, {
    eventCategory: EventCategory.LLM_INTERACTION,
    prompt: promptText,
    metadata: {
      action: 'evaluate',
      source: 'prompt-input',
      interface: 'evaluation-tool',
      timestamp: new Date().toISOString()
    }
  });
  
  // ... rest of function
};
```

## Database Schema

Events are stored in the `TrackingEvent` table with the following structure:

- `id`: Unique identifier for the event
- `userId`: The user who generated the event
- `sessionId`: Session identifier to group related events
- `eventCategory`: Category of the event (NAVIGATION, INTERACTION, etc.)
- `eventType`: Specific event type
- `courseId`: Optional course identifier
- `moduleId`: Optional module identifier
- `lessonId`: Optional lesson identifier
- `metadata`: JSON object with additional event data
- `createdAt`: Timestamp when the event was created

## Automatic Tracking

The `EventTrackingProvider` automatically tracks page views when routes change. This happens in the provider's `useEffect` hook that monitors pathname changes. 