'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/nextauth';
import AuthRequired from '@/components/AuthRequired';
import AIxLayout from '@/components/AIxLayout';

interface Prompt {
  id: string;
  promptText: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export default function MyPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Fetch prompts when component mounts and when user changes
  useEffect(() => {
    async function fetchPrompts() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/prompts`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        
        const data = await response.json();
        setPrompts(data.prompts);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setError('Failed to load your prompts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPrompts();
  }, [user]);
  
  // Toggle favorite status
  const toggleFavorite = async (promptId: string) => {
    try {
      const prompt = prompts.find(p => p.id === promptId);
      
      if (!prompt) return;
      
      const response = await fetch('/api/prompts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId,
          isFavorite: !prompt.isFavorite,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update prompt');
      }
      
      // Update local state
      setPrompts(prompts.map(p => 
        p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
      ));
    } catch (error) {
      console.error('Error updating prompt:', error);
      setError('Failed to update prompt. Please try again.');
    }
  };
  
  // Delete prompt
  const deletePrompt = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/prompts?promptId=${promptId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete prompt');
      }
      
      // Remove from local state
      setPrompts(prompts.filter(p => p.id !== promptId));
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setError('Failed to delete prompt. Please try again.');
    }
  };
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  return (
    <AuthRequired>
      <AIxLayout
        title="My Prompts"
        subtitle="Access, edit, and reuse your saved prompts"
      >
        <div className="flex justify-end mb-6">
          <Link 
            href="/"
            className="px-4 py-2 bg-aixblue-600 text-white rounded-md hover:bg-aixblue-700 font-medium transition-colors"
          >
            Create New Prompt
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-aixblue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : prompts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600 mb-4">You don't have any saved prompts yet.</p>
            <Link 
              href="/"
              className="text-aixblue-600 hover:text-aixblue-800 font-medium"
            >
              Create your first prompt →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {prompts.map((prompt) => (
                <li key={prompt.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {prompt.isFavorite && (
                          <span className="mr-2 text-yellow-500">★</span>
                        )}
                        <h3 className="font-medium text-gray-900 truncate">
                          {prompt.promptText.length > 60
                            ? `${prompt.promptText.substring(0, 60)}...`
                            : prompt.promptText}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        Updated {formatDate(prompt.updatedAt)} • Version {prompt.version}
                      </p>
                    </div>
                    <div className="flex ml-4 space-x-2">
                      <button 
                        onClick={() => toggleFavorite(prompt.id)}
                        className="text-gray-400 hover:text-yellow-500"
                        aria-label={prompt.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {prompt.isFavorite ? '★' : '☆'}
                      </button>
                      <Link 
                        href={`/?promptId=${prompt.id}`}
                        className="text-aixblue-600 hover:text-aixblue-800"
                      >
                        Use
                      </Link>
                      <button 
                        onClick={() => deletePrompt(prompt.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </AIxLayout>
    </AuthRequired>
  );
} 