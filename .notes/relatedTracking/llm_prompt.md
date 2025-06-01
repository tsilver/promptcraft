# LLM_PROMPT Event Schema

## Overview
The `LLM_PROMPT` event captures when a user submits a prompt to an LLM (Large Language Model).
These events help track how users interact with AI components throughout the course and
allow us to analyze prompt quality, usage patterns, and skill development.

## Event Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `eventType` | string | Yes | Must be "LLM_PROMPT" |
| `eventCategory` | string | Yes | Must be "LLM_INTERACTION" |
| `userId` | string | Yes | The ID of the authenticated user |
| `sessionId` | string | Yes | The current session identifier |
| `courseId` | string | Yes | The course ID where the interaction occurred |
| `moduleId` | string | Yes | The module ID where the interaction occurred |
| `prompt` | string | Yes | The actual prompt text submitted by the user |
| `metadata` | object | Yes | Additional context about the prompt |

## Metadata Properties

| Property | Type | Description |
|----------|------|-------------|
| `context` | string | The specific lesson or context of the prompt (e.g., "Tone and Persona") |
| `lessonId` | string | The lesson identifier within the module |
| `source` | string | The component or interface that generated the prompt (e.g., "prompt-tester") |
| `interface` | string | The type of interface that was used (e.g., "course-lesson") |
| `timestamp` | string | ISO timestamp of when the prompt was submitted |

## Implementation Example

```tsx
trackLLMEvent(EventType.LLM_PROMPT, {
  eventCategory: EventCategory.LLM_INTERACTION,
  courseId,
  moduleId,
  prompt,
  metadata: {
    context: lessonContext,
    lessonId,
    source: 'prompt-tester',
    interface: 'course-lesson',
    timestamp: new Date().toISOString()
  }
});
```

## When to Trigger

1. **Prompt Submission:** Immediately when a user submits a prompt, before sending it to the API
2. **Before API Call:** Capture event before making the request to the LLM service
3. **Input Confirmation:** When the user explicitly confirms their input (e.g., clicking "Submit")

## Related Events

1. `LLM_RESPONSE` - The corresponding response event for this prompt
2. `PROMPT_SUBMISSION` - A different event used for assessment scenarios (test answers, etc.)

## Validation Rules

1. `eventType` must be "LLM_PROMPT"
2. `eventCategory` must be "LLM_INTERACTION"
3. `courseId` and `moduleId` are required
4. `prompt` must not be empty
5. `prompt` length should typically be between 10 and 2000 characters
6. `metadata.context` should provide sufficient information about the educational context

## Privacy Considerations

Do not include personal or sensitive information in the prompt field. If needed, sanitize or 
redact personal information before tracking the event. 