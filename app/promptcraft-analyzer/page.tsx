'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEventTracking } from '@/lib/tracking/hooks';
import { EventType, EventCategory } from '@/lib/tracking/types';
import AIxLayout from '@/components/AIxLayout';
import PromptInput from '@/components/PromptInput';
import AuthRequired from '@/components/AuthRequired';

export default function PromptCraftAnalyzerPage() {
  const { data: session } = useSession();
  const user = session?.user || null;
  const router = useRouter();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  
  // Retrieve the selected prompt from localStorage if it exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrompt = localStorage.getItem('selectedPrompt');
      if (savedPrompt) {
        setSelectedPrompt(savedPrompt);
        // Clear it from localStorage so it doesn't persist across visits
        localStorage.removeItem('selectedPrompt');
      }
    }
  }, []);

  return (
    <AuthRequired redirectTo="/">
      <AIxLayout
        title="PromptCraft Analyzer"
        subtitle="Craft, test, and improve your AI prompts with real-time feedback"
      >
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to the PromptCraft Analyzer
            </h2>
            <p className="text-gray-600 mb-6">
              Use this tool to create effective prompts, test them with AI models, and get
              detailed feedback on how to improve them for educational contexts.
            </p>
            
            <div className="mb-8">
              <PromptInput initialPrompt={selectedPrompt} />
            </div>
            
            <div className="bg-aixblue-50 rounded-lg p-4 border border-aixblue-100">
              <h3 className="text-lg font-semibold text-aixblue-800 mb-2">Pro Tips</h3>
              <ul className="list-disc pl-5 text-aixblue-700 space-y-2">
                <li>Be specific about your educational context and goals</li>
                <li>Include details about your target audience (grade level, subject)</li>
                <li>Specify the type of response you want (format, length, tone)</li>
                <li>Test variations of your prompt to see which works best</li>
                <li>Use the feedback to iteratively improve your prompts</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Your Recent Prompts
            </h3>
            <p className="text-gray-500 italic">
              Your recent prompts will appear here. Start by creating a new prompt above.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Prompt Performance
            </h3>
            <p className="text-gray-500 italic">
              Analytics on your prompt performance will appear here after you test multiple prompts.
            </p>
          </div>
        </div>
      </AIxLayout>
    </AuthRequired>
  );
} 