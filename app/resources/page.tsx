'use client';

import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Mock resources data
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Prompt Engineering Guide',
      description: 'A comprehensive guide to prompt engineering concepts, techniques, and best practices.',
      url: 'https://www.promptingguide.ai/',
      tags: ['guide', 'beginners', 'techniques']
    },
    {
      id: '2',
      title: 'Awesome Prompts Repository',
      description: 'A curated list of prompt templates and examples for different tasks and domains.',
      url: 'https://github.com/f/awesome-chatgpt-prompts',
      tags: ['templates', 'examples', 'github']
    },
    {
      id: '3',
      title: 'The Art of Effective Prompting',
      description: 'Learn how to craft prompts that generate high-quality, relevant, and accurate responses.',
      url: 'https://learnprompting.org/',
      tags: ['techniques', 'advanced', 'tutorial']
    },
    {
      id: '4',
      title: 'Educational AI Prompting',
      description: 'Specialized guide for teachers on using AI prompts for educational content creation.',
      url: 'https://aixponential.org/resources',
      tags: ['education', 'teachers', 'examples']
    },
    {
      id: '5',
      title: 'Prompt Engineering for Developers',
      description: 'Technical deep dive into prompt engineering with code examples and implementation strategies.',
      url: 'https://platform.openai.com/docs/guides/prompt-engineering',
      tags: ['developers', 'technical', 'advanced']
    },
    {
      id: '6',
      title: 'Designing Effective Prompts',
      description: 'Visual guide to designing prompts with examples of good and bad prompts.',
      url: 'https://www.anthropic.com/news/claude-2-1-prompting',
      tags: ['design', 'examples', 'visual']
    }
  ];
  
  // Filter resources based on active category and search query
  const filteredResources = resources.filter(resource => {
    // Filter by category
    if (activeCategory !== 'all' && !resource.tags.includes(activeCategory)) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Extract unique tags for categories
  const allTags = Array.from(new Set(resources.flatMap(r => r.tags))).sort();
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Resources</h1>
        <p className="text-gray-600 mb-8">
          Explore these resources to improve your prompt engineering skills and create more effective AI prompts.
        </p>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-1/2">
              <label htmlFor="search" className="sr-only">Search resources</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search resources..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeCategory === 'all'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveCategory(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeCategory === tag
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No resources found</h2>
            <p className="text-gray-600">
              Try changing your search query or select a different category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredResources.map(resource => (
              <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-2">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {resource.title}
                  </a>
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {resource.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Visit Resource
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 