# Event Tracking System Documentation

This document provides comprehensive guidance on integrating the event tracking system into course pages and components.

## Overview

The Event Tracking System provides standardized methods for capturing user interactions, LLM interactions, and proficiency assessments across courses. It follows a consistent pattern to ensure data quality and reliability.

## Architecture

```
Client Component → EventTracking Hook → EventManager → Database
```

The system consists of:
- **Event Types**: Standardized event structures with type safety
- **Event Manager**: Handles queueing, batching, and persistence
- **React Hooks**: Easy integration into components
- **Event Processors**: Custom logic for specific event types (e.g., proficiency calculation)

## Integration Guide

### Basic Usage

```tsx
import { useEventTracking } from '@/lib/tracking/hooks';

function CoursePage() {
  const { trackEvent } = useEventTracking();
  
  useEffect(() => {
    // Track page view when component mounts
    trackEvent('PAGE_VIEW', {
      category: 'NAVIGATION',
      courseId: 'course-123',
      moduleId: 'module-456',
      metadata: {
        referrer: document.referrer
      }
    });
  }, []);
  
  return <div>Course Content</div>;
}
```

### Tracking Course Navigation

```tsx
function CourseNavigation({ courseId }) {
  const { trackEvent } = useEventTracking();
  
  const handleModuleClick = (moduleId) => {
    trackEvent('MODULE_NAVIGATION', {
      category: 'NAVIGATION',
      courseId,
      moduleId,
      metadata: {
        source: 'sidebar-nav'
      }
    });
    
    // Navigate to module
    router.push(`/course/${courseId}/${moduleId}`);
  };
}
```

### Tracking LLM Interactions

```tsx
function PromptExercise({ courseId, moduleId }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const { trackEvent } = useEventTracking();
  
  const handleSubmit = async () => {
    // Get response from API
    const result = await fetch('/api/generate-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, courseId })
    }).then(res => res.json());
    
    setResponse(result.response);
    
    // Track the interaction
    trackEvent('PROMPT_SUBMISSION', {
      category: 'ASSESSMENT',
      courseId,
      moduleId,
      metadata: {
        prompt,
        response: result.response,
        responseLength: result.response.length
      }
    });
  };
}
```

### Tracking User Progress & Proficiency

```tsx
function AssessmentQuestion({ questionId, courseId, skillId }) {
  const { trackEvent } = useEventTracking();
  
  const handleAnswer = async (answer) => {
    const isCorrect = await checkAnswer(answer);
    
    trackEvent('QUESTION_ANSWER', {
      category: 'ASSESSMENT',
      courseId,
      skillId,
      metadata: {
        questionId,
        answer,
        isCorrect,
        timeSpent: getTimeSpent(), // Custom function to calculate time
        attemptNumber: getCurrentAttempt() // Custom function
      }
    });
    
    if (isCorrect) {
      // Update UI or navigate to next question
    }
  };
}
```

## Event Types Reference

### Navigation Events

| Event Type | Description | Required Fields | Optional Fields |
|------------|-------------|-----------------|-----------------|
| PAGE_VIEW | User views a page | courseId | moduleId, lessonId |
| MODULE_START | User starts a module | courseId, moduleId | lessonId |
| MODULE_COMPLETE | User completes a module | courseId, moduleId | |
| LESSON_START | User starts a lesson | courseId, moduleId, lessonId | |
| LESSON_COMPLETE | User completes a lesson | courseId, moduleId, lessonId | |

### Interaction Events

| Event Type | Description | Required Fields | Optional Fields |
|------------|-------------|-----------------|-----------------|
| RESOURCE_CLICK | User clicks a resource | courseId, resourceId | moduleId, lessonId |
| EXTERNAL_LINK_CLICK | User clicks external link | linkUrl | courseId, moduleId |
| VIDEO_PLAY | User plays video | videoId | playbackPosition |
| VIDEO_PAUSE | User pauses video | videoId | playbackPosition |
| VIDEO_COMPLETE | User completes video | videoId | totalDuration |

### Assessment Events

| Event Type | Description | Required Fields | Optional Fields |
|------------|-------------|-----------------|-----------------|
| PROMPT_SUBMISSION | User submits prompt | prompt, courseId | moduleId |
| QUESTION_ANSWER | User answers question | questionId, answer | isCorrect, timeSpent |
| QUIZ_START | User starts quiz | quizId, courseId | moduleId |
| QUIZ_COMPLETE | User completes quiz | quizId, courseId, score | moduleId, timeSpent |

### Proficiency Events

| Event Type | Description | Required Fields | Optional Fields |
|------------|-------------|-----------------|-----------------|
| SKILL_ASSESSMENT | User skill assessed | skillId, proficiencyLevel | evidence |
| COURSE_COMPLETE | User completes course | courseId, completionLevel | totalTimeSpent |

## Best Practices

1. **Track Meaningful Events**: Only track events that provide actionable insights
2. **Consistent Naming**: Use consistent event naming following the pattern `OBJECT_ACTION`
3. **Include Context**: Always include relevant context (courseId, moduleId, etc.)
4. **Enrich Metadata**: Add useful metadata but avoid PII (Personally Identifiable Information)
5. **Error Handling**: Handle tracking failures gracefully to avoid disrupting the user experience

## Implementation Details

### Database Schema

The `TrackingEvent` table stores all events with the following structure:

```
model TrackingEvent {
  id            String    @id @default(cuid())
  userId        String    
  sessionId     String    // To group related events
  eventCategory String    // Category of event (NAVIGATION, ASSESSMENT, etc.)
  eventType     String    // Specific event type
  courseId      String?
  moduleId      String?   // Module identifier
  lessonId      String?   // Lesson identifier
  metadata      Json      // Flexible JSON metadata
  createdAt     DateTime  @default(now())
  // ... additional fields and relations
}
```

### API Endpoints

We provide the following endpoints for event tracking:

- `POST /api/tracking/event` - Record a general tracking event
- `POST /api/tracking/prompt` - Record prompt submission with LLM response
- `POST /api/tracking/assessment` - Record assessment results

## Debugging

Enable debug mode to log events to the console:

```tsx
// In your component
const { trackEvent } = useEventTracking({ debug: true });
```

## Integration Test Example

See [EventTracking.test.tsx](./.notes/EventTracking.test.tsx) for a complete integration test example. 