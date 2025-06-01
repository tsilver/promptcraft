/**
 * Available event categories
 */
export enum EventCategory {
    NAVIGATION = 'NAVIGATION',
    INTERACTION = 'INTERACTION',
    ASSESSMENT = 'ASSESSMENT',
    LLM_INTERACTION = 'LLM_INTERACTION',
    PROFICIENCY = 'PROFICIENCY',
    SYSTEM = 'SYSTEM'
  }
  
  /**
   * Available event types
   */
  export enum EventType {
    // Navigation events
    PAGE_VIEW = 'PAGE_VIEW',
    MODULE_START = 'MODULE_START',
    MODULE_COMPLETE = 'MODULE_COMPLETE',
    LESSON_START = 'LESSON_START',
    LESSON_COMPLETE = 'LESSON_COMPLETE',
    
    // Interaction events
    RESOURCE_CLICK = 'RESOURCE_CLICK',
    EXTERNAL_LINK_CLICK = 'EXTERNAL_LINK_CLICK',
    VIDEO_PLAY = 'VIDEO_PLAY',
    VIDEO_PAUSE = 'VIDEO_PAUSE',
    VIDEO_COMPLETE = 'VIDEO_COMPLETE',
    
    // Assessment events
    PROMPT_SUBMISSION = 'PROMPT_SUBMISSION',
    QUESTION_ANSWER = 'QUESTION_ANSWER',
    QUIZ_START = 'QUIZ_START',
    QUIZ_COMPLETE = 'QUIZ_COMPLETE',
    
    // Proficiency events
    SKILL_ASSESSMENT = 'SKILL_ASSESSMENT',
    COURSE_COMPLETE = 'COURSE_COMPLETE',
    
    // LLM Interaction events
    LLM_PROMPT = 'LLM_PROMPT',
    LLM_RESPONSE = 'LLM_RESPONSE',
    LLM_EVALUATION = 'LLM_EVALUATION'
  }
  
  /**
   * Client information collected with events
   */
  export interface ClientInfo {
    userAgent?: string;
    language?: string;
    viewport?: {
      width: number;
      height: number;
    };
    referrer?: string;
  }
  
  /**
   * Base event interface that all events extend
   */
  export interface BaseEvent {
    id: string;
    userId?: string;
    sessionId?: string;
    eventCategory: EventCategory;
    eventType: EventType;
    timestamp: Date;
    clientInfo?: ClientInfo;
    metadata?: Record<string, any>;
  }
  
  /**
   * Event for course-related actions
   */
  export interface CourseEvent extends BaseEvent {
    courseId: string;
    moduleId?: string;
    lessonId?: string;
    courseVersion?: string;
  }
  
  /**
   * Event for LLM interactions
   */
  export interface LLMInteractionEvent extends BaseEvent {
    courseId?: string;
    prompt: string;
    response?: string;
    model?: string;
    evaluationMetrics?: {
      relevance?: number;
      accuracy?: number;
      completeness?: number;
    };
  }
  
  /**
   * Event for proficiency assessments
   */
  export interface ProficiencyEvent extends CourseEvent {
    skillId: string;
    proficiencyLevel: number;
    assessmentResults?: Record<string, any>;
  }
  
  /**
   * Configuration for event tracking
   */
  export interface EventTrackingConfig {
    debug?: boolean;
    batchSize?: number;
    flushInterval?: number;
    endpoint?: string;
  } 