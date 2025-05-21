'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useEventTracking } from '@/lib/tracking/hooks';
import { EventType, EventCategory } from '@/lib/tracking/types';
import PromptEvaluation from './PromptEvaluation';
import PromptResult from './PromptResult';
import { mockEvaluation, mockExecutionResult, loginPromotionMessage } from '@/lib/mockData';

// Define evaluation data structure to match our component props
interface EvaluationCriterion {
  score: string;
  feedback: string;
}

interface EvaluationData {
  tonePersona: EvaluationCriterion;
  taskClarity: EvaluationCriterion;
  formatOutput: EvaluationCriterion;
  contextBackground: EvaluationCriterion;
  suggestedRefinements: string[];
}

export default function PromptInput() {
  const [promptText, setPromptText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);
  const [resultData, setResultData] = useState<string | null>(null);
  const [activeDisplay, setActiveDisplay] = useState<'none' | 'evaluation' | 'result'>('none');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { user, signIn, isLoading } = useAuth();
  const { trackLLMEvent } = useEventTracking({ debug: true });
  
  // Reset login prompt on user change
  useEffect(() => {
    if (user) {
      setShowLoginPrompt(false);
    }
  }, [user]);
  
  // Function for evaluating prompt
  const handleEvaluate = async () => {
    if (!promptText.trim()) return;
    
    setIsEvaluating(true);
    setActiveDisplay('evaluation');
    setEvaluationData(null);
    
    // Track prompt evaluation event
    trackLLMEvent(EventType.LLM_EVALUATION, {
      eventCategory: EventCategory.LLM_INTERACTION,
      prompt: promptText,
      metadata: {
        action: 'evaluate',
        source: 'prompt-input',
        interface: 'evaluation-tool',
        timestamp: new Date().toISOString(),
        isAuthenticated: !!user
      }
    });
    
    try {
      if (user) {
        // Real API call for logged-in users
        const response = await fetch('/api/prompts/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            promptText,
            userId: user.id
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to evaluate prompt');
        }
        
        const data = await response.json();
        setEvaluationData(data.evaluation);
      } else {
        // Simulated response for non-logged-in users
        // Add a delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setEvaluationData(mockEvaluation);
        setShowLoginPrompt(true);
      }
    } catch (error) {
      console.error('Error evaluating prompt:', error);
    } finally {
      setIsEvaluating(false);
    }
  };
  
  // Function for executing prompt
  const handleExecute = async () => {
    if (!promptText.trim()) return;
    
    setIsExecuting(true);
    setActiveDisplay('result');
    setResultData(null);
    
    // Track prompt execution event
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
    
    try {
      if (user) {
        // Real API call for logged-in users
        const response = await fetch('/api/prompts/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            promptText,
            userId: user.id
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to execute prompt');
        }
        
        const data = await response.json();
        setResultData(data.result);
        
        // Track response received event
        trackLLMEvent(EventType.LLM_RESPONSE, {
          eventCategory: EventCategory.LLM_INTERACTION,
          prompt: promptText,
          response: data.result,
          metadata: {
            action: 'received',
            responseLength: typeof data.result === 'string' ? data.result.length : 0,
            source: 'prompt-input',
            timestamp: new Date().toISOString(),
            isAuthenticated: true
          }
        });
      } else {
        // Simulated response for non-logged-in users
        // Add a delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResultData(mockExecutionResult);
        setShowLoginPrompt(true);
        
        // Track mock response event
        trackLLMEvent(EventType.LLM_RESPONSE, {
          eventCategory: EventCategory.LLM_INTERACTION,
          prompt: promptText,
          response: 'mock_response',
          metadata: {
            action: 'received',
            responseLength: mockExecutionResult.length,
            source: 'prompt-input',
            timestamp: new Date().toISOString(),
            isAuthenticated: false,
            isMockResponse: true
          }
        });
      }
    } catch (error) {
      console.error('Error executing prompt:', error);
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Function for saving prompt
  const handleSave = async () => {
    if (!promptText.trim()) return;
    
    // Check if user is logged in
    if (!user) {
      // Show login dialog
      setShowLoginPrompt(true);
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          promptText,
          userId: user.id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }
      
      const data = await response.json();
      alert('Prompt saved successfully!');
      
      // Track prompt saved event
      trackLLMEvent(EventType.LLM_PROMPT, {
        eventCategory: EventCategory.LLM_INTERACTION,
        prompt: promptText,
        metadata: {
          action: 'save',
          promptId: data.promptId,
          source: 'prompt-input',
          timestamp: new Date().toISOString(),
          isAuthenticated: true
        }
      });
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert('Failed to save prompt');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {showLoginPrompt && !user && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <p className="text-indigo-800 mb-3 sm:mb-0">
            {loginPromotionMessage}
          </p>
          <button
            onClick={signIn}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
      
      <div>
        <label 
          htmlFor="prompt" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Enter Your Prompt Here:
        </label>
        <textarea
          id="prompt"
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Type or paste your AI prompt here..."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleEvaluate}
          disabled={isEvaluating || !promptText.trim() || isLoading}
          className={`px-4 py-2 rounded-md font-medium text-white ${
            isEvaluating || !promptText.trim() || isLoading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isEvaluating ? 'Evaluating...' : 'Evaluate Prompt'}
        </button>
        
        <button
          onClick={handleExecute}
          disabled={isExecuting || !promptText.trim() || isLoading}
          className={`px-4 py-2 rounded-md font-medium text-white ${
            isExecuting || !promptText.trim() || isLoading
              ? 'bg-green-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          }`}
        >
          {isExecuting ? 'Executing...' : 'Use Prompt'}
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving || !promptText.trim() || isLoading}
          className={`px-4 py-2 rounded-md font-medium ${
            isSaving || !promptText.trim() || isLoading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : user 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
          title={!user ? 'Sign in to save prompts' : 'Save this prompt'}
        >
          {isSaving ? 'Saving...' : !user ? 'Sign In to Save' : 'Save Prompt'}
        </button>
      </div>
      
      {/* Display Evaluation or Result based on active tab */}
      {activeDisplay === 'evaluation' && (
        <PromptEvaluation evaluation={evaluationData} isLoading={isEvaluating} />
      )}
      
      {activeDisplay === 'result' && (
        <PromptResult result={resultData} isLoading={isExecuting} />
      )}
    </div>
  );
} 