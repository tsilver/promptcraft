# LESSON_START Event Schema

## Overview
The `LESSON_START` event captures when a user begins a specific lesson within a course module.
This event helps track user progress through course content and should be triggered when a user first accesses a lesson.

## Event Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `eventType` | string | Yes | Must be "LESSON_START" |
| `eventCategory` | string | Yes | Must be "NAVIGATION" |
| `userId` | string | Yes | The ID of the authenticated user |
| `sessionId` | string | Yes | The current session identifier |
| `courseId` | string | Yes | The course ID the lesson belongs to |
| `moduleId` | string | Yes | The module ID the lesson belongs to |
| `lessonId` | string | Yes | The specific lesson identifier |
| `metadata` | object | Yes | Additional context about the lesson |

## Metadata Properties

| Property | Type | Description |
|----------|------|-------------|
| `lessonTitle` | string | The human-readable title of the lesson |
| `lessonOrder` | number | The sequential order of the lesson within its module |
| `from` | string | (Optional) The page/location the user navigated from |
| `source` | string | (Optional) How the lesson was accessed (e.g., "lesson-list", "footer-nav") |

## Implementation Example

```tsx
// In a page component:
useEffect(() => {
  trackCourseEvent(EventType.LESSON_START, {
    eventCategory: EventCategory.NAVIGATION,
    courseId: "prompting-for-educators",
    moduleId: "teach-framework",
    lessonId: "tone-persona",
    metadata: {
      lessonTitle: "Tone and Persona",
      lessonOrder: 1
    }
  });
}, [trackCourseEvent]);

// Or when a user clicks to navigate to a lesson:
const handleLessonNavigation = (lessonId: string) => {
  trackCourseEvent(EventType.LESSON_START, {
    eventCategory: EventCategory.NAVIGATION,
    courseId: "prompting-for-educators",
    moduleId: "teach-framework",
    lessonId,
    metadata: {
      from: "teach-framework",
      to: lessonId,
      source: "lesson-list"
    }
  });
};
```

## When to Trigger

1. **Component Mount:** When a lesson page first loads, trigger in a `useEffect` with an empty dependency array
2. **Navigation Action:** When a user explicitly clicks to navigate to a lesson, trigger before the navigation occurs
3. **Resumption:** When a user returns to a partially completed lesson (optional, depending on requirements)

## Validation Rules

1. `eventType` must be "LESSON_START"
2. `eventCategory` must be "NAVIGATION"
3. `courseId`, `moduleId`, and `lessonId` are all required
4. `lessonId` should correspond to a valid lesson within the specified module
5. If `lessonOrder` is provided, it should be a positive integer representing the lesson's position 