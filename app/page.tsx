import Link from 'next/link';
import PromptInput from '@/components/PromptInput';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          AI PromptCraft Analyzer
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Craft and Analyze Your AI Prompts</h2>
          <p className="text-gray-600 mb-6">
            Enter your prompt below to evaluate its effectiveness, test it with an AI model, 
            and get suggestions for improvement.
          </p>
          <PromptInput />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Learn Prompt Engineering</h3>
            <p className="text-gray-600 mb-4">
              Explore our resources to improve your prompt writing skills.
            </p>
            <Link 
              href="/resources"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Resources →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Your Saved Prompts</h3>
            <p className="text-gray-600 mb-4">
              Access, edit, and reuse your previously saved prompts.
            </p>
            <Link 
              href="/my-prompts" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Your Prompts →
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">Prompt Templates</h3>
            <p className="text-gray-600 mb-4">
              Get started with pre-built effective prompt templates.
            </p>
            <Link 
              href="/templates" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse Templates →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 