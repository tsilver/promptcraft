# Data Tracking System Documentation

This document provides a comprehensive overview of the data tracking system used in the application, focusing on how user data, events, prompt activities, and example prompts are stored and managed.

## Database Schema Overview

The application uses a relational database with Prisma as the ORM. The core models for tracking are:

### User Management
- `User`: Core user entity storing authentication and profile data
- `AnonymousTrackingProfile`: Links anonymous sessions to authenticated users
- `Session`: Manages user sessions for authentication

### Event Tracking
- `TrackingEvent`: Records all user interactions and events across the application
- See [EventTracking.md](./.notes/EventTracking.md) for detailed tracking system architecture

### Prompt Engineering
- `Prompt`: Stores user-created prompts
- `PromptEvaluation`: Stores evaluation results for prompts
- `PromptResult`: Stores execution results for prompts
- `ExamplePrompt`: Curated example prompts for users to reference

## User Registration and Authentication Flow

1. **Anonymous User Session**
   - When a user first visits the site, they're assigned an anonymous ID
   - This ID is stored in localStorage and as a cookie for cross-session identification
   - Anonymous activities are tracked with this ID in the `metadata.anonymousId` field

2. **Authentication**
   - When a user signs in via Google Auth (NextAuth):
   - User record is created/updated in the database
   - Anonymous tracking profile is linked to authenticated user
   - Subsequent events are attributed to the authenticated user ID

3. **Linking Anonymous to Authenticated**
   - The system attempts to link previous anonymous activity by:
   - Finding the anonymous ID in event metadata
   - Creating/updating an `AnonymousTrackingProfile` record
   - This allows for continuous user journey analysis across authentication states

## Event Tracking Implementation

### Core Event Structure
```typescript
interface BaseEvent {
  id: string;
  timestamp: Date;
  eventType: EventType;
  eventCategory: EventCategory;
  userId?: string;
  sessionId: string;
  metadata: Record<string, any>;
  clientInfo?: ClientInfo;
}
```

### Event Categories
- `NAVIGATION`: Page views, course navigation ([page_view.md](./.notes/page_view.md), [lesson_start.md](./.notes/lesson_start.md))
- `LLM_INTERACTION`: AI interactions like prompts and responses ([llm_prompt.md](./.notes/llm_prompt.md))
- `ASSESSMENT`: Quiz completions, skill assessments
- `PROFICIENCY`: Skill level measurements

### Event Types
The system supports various event types as defined in `lib/tracking/types.ts`:
- `PAGE_VIEW`: When users view a page
- `LESSON_START`: When users begin a lesson
- `LLM_PROMPT`: When users submit a prompt to an LLM
- `LLM_RESPONSE`: When an LLM response is received
- `LLM_EVALUATION`: When a prompt is evaluated

### Implementation Flow
1. **Client Components**
   ```tsx
   // In a component
   const { trackLLMEvent } = useEventTracking();
   
   // Track when user submits a prompt
   trackLLMEvent(EventType.LLM_PROMPT, {
     eventCategory: EventCategory.LLM_INTERACTION,
     prompt: promptText,
     metadata: {
       action: 'execute',
       source: 'prompt-input',
       interface: 'execution-tool',
       timestamp: new Date().toISOString(),
       isAuthenticated: !!user
     }
   });
   ```

2. **Event Manager**
   - Batches events for efficient network usage
   - Enriches events with client information
   - Handles retry logic for failed submissions

3. **API Endpoint**
   ```typescript
   // In app/api/tracking/event/route.ts
   export async function POST(request: Request) {
     // Get authenticated user if available
     const session = await getServerSession(authOptions);
     const authenticatedUserId = session?.user?.id;
     
     // Process events
     const processedEvents = events.map(event => ({
       id: event.id,
       userId: authenticatedUserId || event.userId || anonymousUserId,
       // ... other fields
     }));
     
     // Store in database
     await prisma.$transaction(
       processedEvents.map(event => 
         prisma.trackingEvent.create({ data: event })
       )
     );
   }
   ```

## Prompt Activity Tracking

### User Prompts

1. **Creation**
   ```typescript
   // Create a prompt linked to the authenticated user
   const prompt = await prisma.prompt.create({
     data: {
       promptText,
       userId,
     },
   });
   ```

2. **Evaluation**
   ```typescript
   // Store evaluation in database if user is authenticated
   if (userId) {
     // First find or create the prompt
     const prompt = await prisma.prompt.upsert({
       where: { id: userId + '-temp' },
       update: { promptText, updatedAt: new Date() },
       create: { id: userId + '-temp', userId, promptText },
     });
     
     // Then create the evaluation linked to the prompt
     await prisma.promptEvaluation.create({
       data: {
         evaluationData: evaluation,
         promptId: prompt.id,
       },
     });
   }
   ```

3. **Execution**
   ```typescript
   // Store result linked to the prompt
   await prisma.promptResult.create({
     data: {
       resultText: result,
       promptId: prompt.id,
     },
   });
   ```

### Example Prompts

1. **Storage**
   - Example prompts are stored in the `ExamplePrompt` table
   - These are categorized by type, grade level, and category

2. **Usage Tracking**
   ```typescript
   // Increment the prompt's use count
   const examplePrompt = await prisma.examplePrompt.update({
     where: { id },
     data: {
       useCount: { increment: 1 },
     },
   });
   ```

## Use Cases

### 1. User Journey Analysis
- Track a user's progression through course content
- Link anonymous to authenticated sessions for full journey visibility
- Analyze drop-off points and engagement patterns

### 2. LLM Interaction Analysis
- Evaluate prompt quality improvement over time
- Track which types of prompts generate the most useful responses
- Identify common patterns in user-submitted prompts

### 3. Content Effectiveness
- Determine which example prompts are most frequently used
- Analyze completion rates for different modules and lessons
- Compare engagement metrics across course sections

### 4. User Prompt Management
- Users can save, organize, and reuse their prompts
- Tracking which prompts have been evaluated and executed
- Favorites functionality for frequently used prompts

## Best Practices

### 1. Consistent Event Structure
- Always use the appropriate event type and category
- Include relevant context (courseId, moduleId, lessonId)
- Follow the pattern in [EventTracking.md](./EventTracking.md) for implementation

### 2. Authentication Handling
- Check for authenticated user in server-side API routes
- Use `getServerSession()` to retrieve session data
- Fall back to anonymous tracking when appropriate

### 3. Privacy Considerations
- Store only necessary user information
- Avoid storing sensitive data in event metadata
- Consider data retention policies for tracking data

### 4. Performance Optimization
- Use batch processing for tracking events
- Consider the impact of tracking on UI performance
- Implement retry mechanisms for failed tracking requests

## Schema Compatibility with External Applications

Parts of this schema are designed to be compatible with other applications that share similar tracking needs:

- **Event Structure**: The `TrackingEvent` model follows the structure outlined in [EventTracking.md](./EventTracking.md)
- **Navigation Events**: Page views and lesson navigation follow the patterns in [page_view.md](./page_view.md) and [lesson_start.md](./lesson_start.md)
- **LLM Interactions**: Prompt tracking follows the structure in [llm_prompt.md](./llm_prompt.md)

When integrating with these systems, ensure that:
1. Event types and categories match the expected values
2. Required fields are included for each event type
3. Metadata follows the specified structure for each event type

## Event Schemas Reference

For detailed information on specific event schemas, refer to:

- [PAGE_VIEW](./.notes/page_view.md): Page navigation events
- [LESSON_START](./.notes/lesson_start.md): Course lesson navigation
- [LLM_PROMPT](./.notes/llm_prompt.md): AI prompt submission events
- [EventTracking.md](./.notes/EventTracking.md): Overall event tracking system

## Database Schema Diagram

```
┌────────────────────┐     ┌─────────────────────────┐
│ User               │     │ AnonymousTrackingProfile│
├────────────────────┤     ├─────────────────────────┤
│ id                 │     │ id                      │
│ name               │     │ anonymousId             │◄────┐
│ email              │     │ userId                  │────►│
│ image              │     │ firstSeen               │     │
│ createdAt          │     │ lastSeen                │     │
│ updatedAt          │     │ metadata                │     │
└────────────────────┘     └─────────────────────────┘     │
        │                                                   │
        │                                                   │
        ▼                                                   │
┌────────────────────┐     ┌─────────────────────────┐     │
│ TrackingEvent      │     │ Prompt                  │     │
├────────────────────┤     ├─────────────────────────┤     │
│ id                 │     │ id                      │     │
│ userId             │────►│ userId                  │────►│
│ sessionId          │     │ promptText              │     │
│ eventCategory      │     │ version                 │     │
│ eventType          │     │ createdAt               │     │
│ courseId           │     │ updatedAt               │     │
│ moduleId           │     │ isFavorite              │     │
│ lessonId           │     └─────────────────────────┘     │
│ metadata           │              │                      │
│ createdAt          │              │                      │
└────────────────────┘              │                      │
                                    ▼                      │
                    ┌───────────────────────────┐          │
                    │ PromptEvaluation          │          │
                    ├───────────────────────────┤          │
                    │ id                        │          │
                    │ promptId                  │          │
                    │ evaluationData            │          │
                    │ evaluatedAt               │          │
                    └───────────────────────────┘          │
                                                           │
                    ┌───────────────────────────┐          │
                    │ PromptResult              │          │
                    ├───────────────────────────┤          │
                    │ id                        │          │
                    │ promptId                  │          │
                    │ resultText                │          │
                    │ generatedAt               │          │
                    └───────────────────────────┘          │
                                                           │
                    ┌───────────────────────────┐          │
                    │ ExamplePrompt             │          │
                    ├───────────────────────────┤          │
                    │ id                        │          │
                    │ title                     │          │
                    │ text                      │          │
                    │ category                  │          │
                    │ gradeLevel                │          │
                    │ type                      │          │
                    │ useCount                  │          │
                    │ isActive                  │          │
                    └───────────────────────────┘          │
                                                           │
┌────────────────────┐                                     │
│ Session            │                                     │
├────────────────────┤                                     │
│ id                 │                                     │
│ sessionToken       │                                     │
│ userId             │◄────────────────────────────────────┘
│ expires            │
└────────────────────┘
```

This diagram shows the key relationships between the primary entities in the tracking system:

1. The `User` entity is central, linking to:
   - `TrackingEvent` records (user interactions)
   - `Prompt` records (user-created prompts)
   - `Session` records (authentication sessions)
   - `AnonymousTrackingProfile` (linking anonymous to authenticated activity)

2. The `Prompt` entity connects to:
   - `PromptEvaluation` (quality assessments)
   - `PromptResult` (execution outputs)

3. `ExamplePrompt` stands alone as a reference resource

The relationships enable comprehensive tracking across the user journey, from anonymous browsing through authenticated prompt creation and evaluation. 

## Cross-System Compatibility and Integration

The tracking system is designed to work alongside other applications that require similar event tracking capabilities. To ensure compatibility across multiple systems:

### Shared Event Schema Standards

Both this application and related systems like those documented in the existing event schema files (.notes/EventTracking.md, etc.) should adhere to these standards:

1. **Consistent Event Naming**
   - Use the `OBJECT_ACTION` pattern (e.g., `PAGE_VIEW`, `LESSON_START`)
   - Maintain a shared event type registry to prevent duplicates or overlaps

2. **Required Core Fields**
   - Every event must include: `id`, `timestamp`, `eventType`, `eventCategory`, `userId` (if authenticated)
   - Contextual fields like `courseId` should be present when the event occurs in a course context

3. **Standard Metadata Structure**
   - Use consistent keys in metadata objects (e.g., `source`, `referrer`)
   - Nest complex data rather than flattening it
   - Document all metadata fields that have specific meaning

### Integration Patterns

When integrating this tracking system with other applications:

1. **API Gateway Pattern**
   - Use a central event collection API that routes events to appropriate systems
   - Example: `/api/tracking/event` receives all events and distributes as needed

2. **Event Bus Architecture**
   - Consider using a message broker (RabbitMQ, Kafka) for high-volume deployments
   - Allows for async processing and multiple consumers of event data

3. **Shared User Identity**
   - Ensure consistent user identification across systems
   - Use federation or single sign-on to maintain continuity

### Implementation Examples

#### 1. Multi-Application Event Collection

```typescript
// Centralized event collector that routes to different systems
export async function POST(request: Request) {
  const { events } = await request.json();
  
  // Store in primary database
  await storeEvents(events);
  
  // Forward events to analytics system if applicable
  if (shouldForwardToAnalytics(events)) {
    await forwardToAnalytics(events);
  }
  
  // Send LLM-specific events to LLM monitoring system
  const llmEvents = events.filter(e => 
    e.eventCategory === 'LLM_INTERACTION'
  );
  
  if (llmEvents.length > 0) {
    await sendToLLMMonitoring(llmEvents);
  }
  
  return NextResponse.json({ success: true });
}
```

#### 2. Cross-Application User Journey Tracking

```typescript
// Link user identities across applications
async function linkUserIdentities(userId, externalSystemIds) {
  await prisma.userIdentityMapping.upsert({
    where: { userId },
    update: { externalSystemIds },
    create: { userId, externalSystemIds }
  });
}

// Retrieve events across systems for a single user
async function getUserJourney(userId) {
  // Get user ID mappings
  const identityMapping = await prisma.userIdentityMapping.findUnique({
    where: { userId }
  });
  
  // Get events from primary system
  const primaryEvents = await prisma.trackingEvent.findMany({
    where: { userId }
  });
  
  // Get events from external systems using mapped IDs
  const externalEvents = await fetchExternalEvents(
    identityMapping.externalSystemIds
  );
  
  // Merge and sort all events by timestamp
  return [...primaryEvents, ...externalEvents]
    .sort((a, b) => a.timestamp - b.timestamp);
}
```

### Validation and Testing

To ensure cross-system compatibility:

1. **Schema Validation**
   - Implement runtime validation of event structure
   - Use TypeScript interfaces or validation libraries (Zod, Joi)

2. **Integration Tests**
   - Test event flow between systems
   - Validate events are correctly received and processed

3. **Monitoring**
   - Track event processing success rates
   - Alert on event schema validation failures

By following these integration patterns and best practices, the tracking system can work effectively across multiple applications while maintaining data consistency and analytical value. 

## Data Analysis and Reporting

The tracking system is designed not just for data collection but also to enable powerful analysis and reporting capabilities. Here's how to leverage the collected data:

### Types of Analyses

#### 1. User Behavior Analysis

- **Journey Mapping**: Track a user's path through the application
  ```sql
  SELECT e.eventType, e.timestamp, e.metadata
  FROM TrackingEvent e
  WHERE e.userId = 'user-123'
  ORDER BY e.timestamp ASC
  ```

- **Engagement Metrics**: Measure time spent, interactions per session
  ```sql
  SELECT 
    sessionId,
    COUNT(*) as interactionCount,
    MAX(timestamp) - MIN(timestamp) as sessionDuration
  FROM TrackingEvent
  GROUP BY sessionId
  ORDER BY sessionDuration DESC
  ```

- **Drop-off Analysis**: Identify where users abandon processes
  ```sql
  WITH funnel AS (
    SELECT 
      userId,
      MAX(CASE WHEN eventType = 'PAGE_VIEW' THEN 1 ELSE 0 END) as viewed,
      MAX(CASE WHEN eventType = 'LLM_PROMPT' THEN 1 ELSE 0 END) as attempted,
      MAX(CASE WHEN eventType = 'PROMPT_SAVE' THEN 1 ELSE 0 END) as completed
    FROM TrackingEvent
    GROUP BY userId
  )
  SELECT 
    SUM(viewed) as viewCount,
    SUM(attempted) as attemptCount,
    SUM(completed) as completionCount,
    SUM(attempted) / SUM(viewed) as attemptRate,
    SUM(completed) / SUM(attempted) as completionRate
  FROM funnel
  ```

#### 2. Prompt Engineering Analysis

- **Prompt Quality Trends**: Track improvement in user prompt quality over time
  ```sql
  SELECT 
    DATE_TRUNC('week', pe.evaluatedAt) as week,
    AVG(pe.evaluationData->>'tonePersona'->>'score') as avgToneScore,
    AVG(pe.evaluationData->>'taskClarity'->>'score') as avgClarityScore
  FROM PromptEvaluation pe
  JOIN Prompt p ON pe.promptId = p.id
  WHERE p.userId = 'user-123'
  GROUP BY week
  ORDER BY week
  ```

- **Most Effective Prompt Patterns**: Identify patterns in successful prompts
  ```sql
  SELECT 
    p.promptText,
    COUNT(pr.id) as resultCount,
    AVG(LENGTH(pr.resultText)) as avgResponseLength
  FROM Prompt p
  JOIN PromptResult pr ON p.id = pr.promptId
  GROUP BY p.promptText
  ORDER BY avgResponseLength DESC
  ```

#### 3. Example Prompt Usage

- **Popular Examples**: Track which example prompts are most used
  ```sql
  SELECT 
    title,
    category,
    useCount
  FROM ExamplePrompt
  ORDER BY useCount DESC
  LIMIT 10
  ```

- **Category Popularity**: Analyze which categories generate most interest
  ```sql
  SELECT 
    category,
    SUM(useCount) as totalUses,
    COUNT(*) as promptCount,
    SUM(useCount) / COUNT(*) as avgUsesPerPrompt
  FROM ExamplePrompt
  GROUP BY category
  ORDER BY totalUses DESC
  ```

### Reporting Dashboards

Based on the collected data, several reporting dashboards can be created:

1. **User Engagement Dashboard**
   - Daily/weekly active users
   - Session duration and frequency
   - Feature usage breakdown

2. **Prompt Engineering Dashboard**
   - Prompt quality metrics over time
   - Evaluation score distributions
   - Common feedback themes

3. **Content Effectiveness Dashboard**
   - Example prompt usage rates
   - Category and grade level popularity
   - User-generated vs. example prompt usage

4. **Learning Journey Dashboard**
   - Course progression rates
   - Time spent per module/lesson
   - Correlation between prompt practice and quality

### Data Export and Integration

To support external analysis tools:

1. **Scheduled Exports**
   - Generate CSV/JSON exports of key metrics
   - Archive historical data for long-term analysis

2. **BI Tool Integration**
   - Connect tracking database to tools like Tableau, Power BI
   - Create live dashboards with drill-down capabilities

3. **Custom Analysis Scripts**
   - Develop Python/R scripts for advanced statistical analysis
   - Schedule regular reports for stakeholders

### Privacy and Compliance in Reporting

When creating reports and analyses:

1. **Data Aggregation**
   - Prefer aggregated metrics over individual user data
   - Use cohort analysis to preserve privacy

2. **PII Protection**
   - Remove personally identifiable information from exports
   - Hash user IDs when sharing data externally

3. **Access Controls**
   - Implement role-based access to reports
   - Audit report access and usage

By utilizing these analysis techniques and reporting structures, the tracking system can provide valuable insights into user behavior, prompt effectiveness, and overall application usage patterns. 