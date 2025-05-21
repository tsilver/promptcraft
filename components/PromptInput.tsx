'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useEventTracking } from '@/lib/tracking/hooks';
import { EventType, EventCategory } from '@/lib/tracking/types';
import PromptEvaluation from './PromptEvaluation';
import PromptResult from './PromptResult';

export default function PromptInput() {
  const [promptText, setPromptText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [activeDisplay, setActiveDisplay] = useState<'none' | 'evaluation' | 'result'>('none');
  const { user } = useAuth();
  const { trackLLMEvent } = useEventTracking({ debug: true });
  
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
        timestamp: new Date().toISOString()
      }
    });
    
    try {
      const response = await fetch('/api/prompts/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          promptText,
          userId: user?.id // Include user ID if available
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to evaluate prompt');
      }
      
      const data = await response.json();
      setEvaluationData(data.evaluation);
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
        timestamp: new Date().toISOString()
      }
    });
    
    try {
      const response = await fetch('/api/prompts/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          promptText,
          userId: user?.id // Include user ID if available
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
        response: data.result.resultText,
        metadata: {
          action: 'received',
          responseLength: data.result.resultText.length,
          source: 'prompt-input',
          timestamp: new Date().toISOString()
        }
      });
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
      alert('Please sign in to save prompts');
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
          timestamp: new Date().toISOString()
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
          disabled={isEvaluating || !promptText.trim()}
          className={`px-4 py-2 rounded-md font-medium text-white ${
            isEvaluating || !promptText.trim()
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isEvaluating ? 'Evaluating...' : 'Evaluate Prompt'}
        </button>
        
        <button
          onClick={handleExecute}
          disabled={isExecuting || !promptText.trim()}
          className={`px-4 py-2 rounded-md font-medium text-white ${
            isExecuting || !promptText.trim()
              ? 'bg-green-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          }`}
        >
          {isExecuting ? 'Executing...' : 'Use Prompt'}
        </button>
        
        <button
          onClick={handleSave}
          disabled={isSaving || !promptText.trim() || !user}
          className={`px-4 py-2 rounded-md font-medium text-gray-700 ${
            isSaving || !promptText.trim() || !user
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
          }`}
          title={!user ? 'Sign in to save prompts' : 'Save this prompt'}
        >
          {isSaving ? 'Saving...' : 'Save Prompt'}
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