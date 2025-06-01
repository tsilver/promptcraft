# PAGE_VIEW Event Schema

## Overview
The `PAGE_VIEW` event captures when a user navigates to a page within the application. 
This is a core navigation event that should be implemented on all course pages.

## Event Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `eventType` | string | Yes | Must be "PAGE_VIEW" |
| `eventCategory` | string | Yes | Must be "NAVIGATION" |
| `userId` | string | Yes | The ID of the authenticated user |
| `sessionId` | string | Yes | The current session identifier |
| `courseId` | string | No | The course ID if viewing a course page (null for non-course pages) |
| `moduleId` | string | No | The module ID if viewing a module page |
| `lessonId` | string | No | The lesson ID if viewing a lesson page |
| `metadata` | object | Yes | Additional context about the page view |

## Metadata Properties

| Property | Type | Description |
|----------|------|-------------|
| `path` | string | The current page path |
| `previousPath` | string | The path the user navigated from |
| `query` | object | Any query parameters in the URL |
| `referrer` | string | (Optional) The document referrer |

## Implementation Example

```tsx
useEffect(() => {
  trackCourseEvent(EventType.PAGE_VIEW, {
    eventCategory: EventCategory.NAVIGATION,
    courseId: 'prompting-for-educators', // Optional
    moduleId: 'teach-framework',         // Optional
    lessonId: 'tone-persona',            // Optional
    metadata: {
      page: 'tone-persona',              // Optional descriptive name
      path: '/course/teach-framework/tone-persona',
      referrer: document.referrer
    }
  });
}, [trackCourseEvent]);
```

## Automatic Tracking
The `EventTrackingProvider` in `_app.tsx` automatically tracks page views for route changes, but we also implement explicit tracking in each component to:

1. Ensure the initial page load is captured
2. Add additional context and metadata specific to the page
3. Provide redundancy in case the automatic tracking fails

## Validation Rules

1. `eventType` must be "PAGE_VIEW"
2. `eventCategory` must be "NAVIGATION"
3. `path` in metadata must be a valid application route
4. For course pages, `courseId` should be provided
5. For module pages, both `courseId` and `moduleId` should be provided
6. For lesson pages, `courseId`, `moduleId`, and `lessonId` should all be provided 