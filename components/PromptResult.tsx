'use client';

import { useState, useEffect } from 'react';

interface PromptResultProps {
  result: string | null;
  isLoading: boolean;
}

export default function PromptResult({ result, isLoading }: PromptResultProps) {
  const [formattedResult, setFormattedResult] = useState<string>('');
  
  // Format the result when it changes
  useEffect(() => {
    if (result) {
      const formatted = hasMarkdownFeatures(result) 
        ? markdownToHtml(result) 
        : formatPlainText(result);
      setFormattedResult(formatted);
    }
  }, [result]);
  
  if (isLoading) {
    return (
      <div className="mt-8 border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Generating Response...</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return null;
  }
  
  return (
    <div className="mt-8 border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Response</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigator.clipboard.writeText(result)}
            className="px-3 py-1 text-sm bg-gray-100 rounded border hover:bg-gray-200"
            title="Copy response to clipboard"
          >
            Copy
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div 
          className="prose prose-indigo max-w-none"
          dangerouslySetInnerHTML={{ __html: formattedResult }}
        />
      </div>
    </div>
  );
}

// Check if the text likely contains markdown
function hasMarkdownFeatures(text: string): boolean {
  return (
    text.includes('#') || 
    text.includes('```') || 
    text.includes('*') ||
    text.includes('|') ||
    /\d+\.\s/.test(text) ||
    /\[.+\]\(.+\)/.test(text)
  );
}

// Simple markdown to HTML conversion
function markdownToHtml(markdown: string): string {
  // Convert headers
  let html = markdown
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Convert code blocks
  html = html.replace(/```([a-z]*)\n([\s\S]*?)\n```/gm, '<pre><code class="language-$1">$2</code></pre>');
  
  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Convert bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Convert lists
  html = html.replace(/^\d+\.\s(.*)$/gm, '<li>$1</li>');
  html = html.replace(/^-\s(.*)$/gm, '<li>$1</li>');
  
  // Wrap adjacent list items in ul/ol tags
  html = html.replace(/<li>(.+)<\/li>\n<li>/g, '<li>$1</li>\n<li>');
  html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
  
  // Convert line breaks (only those not already handled)
  html = html.replace(/\n\n/g, '</p><p>');
  
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<p') && !html.startsWith('<ul') && !html.startsWith('<pre')) {
    html = `<p>${html}</p>`;
  }
  
  return html;
}

// Format plain text with paragraphs and line breaks
function formatPlainText(text: string): string {
  return `<p>${text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
} 