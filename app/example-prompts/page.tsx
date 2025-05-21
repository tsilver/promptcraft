'use client';

import { useState } from 'react';
import Link from 'next/link';

const EXAMPLE_PROMPTS = [
  {
    title: "Lesson Plan Generator",
    text: "Create a detailed 5th-grade science lesson plan about ecosystems. Include learning objectives, materials needed, step-by-step activities, assessment strategies, and extension ideas. The lesson should be 45 minutes long and aligned with Next Generation Science Standards.",
    category: "Education"
  },
  {
    title: "Quiz Creator",
    text: "Create a 10-question quiz on photosynthesis for high school biology students. Include a mix of multiple-choice, fill-in-the-blank, and short-answer questions. Provide an answer key with explanations.",
    category: "Education"
  },
  {
    title: "Writing Prompt Generator",
    text: "Generate 5 creative writing prompts for middle school students that encourage critical thinking about environmental issues. Each prompt should be 2-3 sentences and include a scenario, character, and conflict.",
    category: "Education"
  },
  {
    title: "Feedback Generator",
    text: "Generate constructive feedback for a student essay that needs improvement in organization and evidence. The feedback should be specific, actionable, and encouraging. Include at least 3 strengths and 3 areas for improvement.",
    category: "Education"
  },
  {
    title: "Email to Parents",
    text: "Draft a professional email to parents about an upcoming field trip to the Natural History Museum. Include details about the date (May 15th), transportation (school bus), cost ($12), what students should bring (lunch, water bottle, comfortable shoes), and how parents can volunteer as chaperones.",
    category: "Communication"
  }
];

export default function ExamplePrompts() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };
  
  const usePrompt = (text: string) => {
    // Store in localStorage and redirect to home page
    localStorage.setItem('selectedPrompt', text);
    window.location.href = '/';
  };
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Example Prompts</h1>
          <div className="flex space-x-4">
            <Link
              href="/example-prompts/test-gemini"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              Test Gemini API
            </Link>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Browse these example prompts to get started with AI PromptCraft. Click "Use This Prompt" to load the prompt into the editor.
            </p>
            
            <div className="grid gap-4 mt-6">
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{prompt.title}</h3>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mt-1">
                        {prompt.category}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(prompt.text)}
                        className="px-3 py-1 text-sm font-medium border rounded hover:bg-gray-50"
                        title="Copy to clipboard"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => usePrompt(prompt.text)}
                        className="px-3 py-1 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className={`mt-3 ${selectedPrompt === prompt.text ? 'block' : 'line-clamp-2'} text-gray-600`}
                  >
                    {prompt.text}
                  </div>
                  
                  {prompt.text.length > 150 && (
                    <button
                      onClick={() => setSelectedPrompt(selectedPrompt === prompt.text ? null : prompt.text)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 font-medium"
                    >
                      {selectedPrompt === prompt.text ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 