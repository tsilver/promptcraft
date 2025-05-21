'use client';

import { useState } from 'react';
import { useEventTracking } from '@/lib/tracking/hooks';
import { EventType, EventCategory } from '@/lib/tracking/types';
import Link from 'next/link';
import AIxLayout from '@/components/AIxLayout';

export default function TestGeminiPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get tracking function
  const { trackLLMEvent } = useEventTracking({ debug: true });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Track LLM prompt submission
    trackLLMEvent(EventType.LLM_PROMPT, {
      eventCategory: EventCategory.LLM_INTERACTION,
      prompt,
      metadata: {
        source: 'test-gemini-page',
        action: 'test',
        timestamp: new Date().toISOString()
      }
    });
    
    try {
      const response = await fetch('/api/prompts/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptText: prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data.result);
      
      // Track successful response
      trackLLMEvent(EventType.LLM_RESPONSE, {
        eventCategory: EventCategory.LLM_INTERACTION,
        prompt,
        response: data.result,
        metadata: {
          source: 'test-gemini-page',
          action: 'received',
          responseLength: data.result.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Error testing Gemini:', err);
      setError((err as Error).message);
      
      // Track error
      trackLLMEvent(EventType.LLM_RESPONSE, {
        eventCategory: EventCategory.LLM_INTERACTION,
        prompt,
        metadata: {
          source: 'test-gemini-page',
          action: 'error',
          errorMessage: (err as Error).message,
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AIxLayout
      title="Gemini API Test"
      subtitle="Test the Gemini API with your prompts"
    >
      <div className="mb-6 flex justify-end">
        <Link href="/example-prompts" className="text-aixblue-600 hover:text-aixblue-800">
          Back to Examples
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Test Prompt
          </label>
          <textarea 
            id="prompt"
            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-aixblue-500 focus:border-aixblue-500"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
          />
        </div>
        
        <button 
          type="submit"
          disabled={!prompt.trim() || loading}
          className={`px-4 py-2 rounded ${loading || !prompt.trim() ? 'bg-aixblue-300' : 'bg-aixblue-600 hover:bg-aixblue-700'} text-white font-medium`}
        >
          {loading ? 'Testing...' : 'Test Prompt'}
        </button>
      </form>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Result:</h2>
          <div className="p-4 bg-gray-50 border rounded-md whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
      
      <div className="bg-aixblue-50 p-4 border border-aixblue-100 rounded-md">
        <h3 className="font-medium text-aixblue-800 mb-2">Event Tracking Demo</h3>
        <p className="text-aixblue-700 text-sm">
          This page demonstrates LLM interaction tracking. Open your browser console to see the events being tracked.
        </p>
      </div>
    </AIxLayout>
  );
} 