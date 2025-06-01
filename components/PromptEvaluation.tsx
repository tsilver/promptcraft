'use client';

import { useState } from 'react';
import Link from 'next/link';

// Define the evaluation data structure based on TEACH framework
interface EvaluationCriterion {
  score: string;
  feedback: string;
  learnMoreUrl?: string;
}

interface EvaluationData {
  tonePersona: EvaluationCriterion;
  explicitTask: EvaluationCriterion;
  arrangementOutput: EvaluationCriterion;
  contextConstraints: EvaluationCriterion;
  higherLevelRefinements: EvaluationCriterion;
  suggestedRefinements: string[];
}

interface PromptEvaluationProps {
  evaluation: EvaluationData | null;
  isLoading: boolean;
}

export default function PromptEvaluation({ evaluation, isLoading }: PromptEvaluationProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  
  if (isLoading) {
    return (
      <div className="mt-8 border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Evaluating Prompt...</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }
  
  if (!evaluation) {
    return null;
  }
  
  // Helper function to get badge color based on score
  const getBadgeColor = (score: string) => {
    switch (score.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'needs improvement':
        return 'bg-amber-100 text-amber-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleCopySuggestions = () => {
    const suggestions = evaluation.suggestedRefinements.map(s => `- ${s}`).join("\n");
    navigator.clipboard.writeText(suggestions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="mt-8 border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b p-4">
        <h2 className="text-xl font-semibold">Prompt Evaluation - TEACH Framework</h2>
        <p className="text-sm text-gray-600 mt-1">
          Evaluation based on the TEACH Prompting Framework for educators
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'all'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Criteria
        </button>
        <button
          onClick={() => setActiveTab('refinements')}
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === 'refinements'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Suggested Refinements
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* Summary Bar */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div 
                className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(evaluation.tonePersona.score)}`}
              >
                T - Tone: {evaluation.tonePersona.score}
              </div>
              <div 
                className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(evaluation.explicitTask.score)}`}
              >
                E - Task: {evaluation.explicitTask.score}
              </div>
              <div 
                className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(evaluation.arrangementOutput.score)}`}
              >
                A - Arrangement: {evaluation.arrangementOutput.score}
              </div>
              <div 
                className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(evaluation.contextConstraints.score)}`}
              >
                C - Context: {evaluation.contextConstraints.score}
              </div>
              <div 
                className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(evaluation.higherLevelRefinements.score)}`}
              >
                H - Higher Level: {evaluation.higherLevelRefinements.score}
              </div>
            </div>
            
            {/* T - Tone & Persona */}
            <div className="border border-gray-100 rounded-md p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">T - Tone & Persona</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(evaluation.tonePersona.score)}`}>
                    {evaluation.tonePersona.score}
                  </span>
                </div>
                {evaluation.tonePersona.learnMoreUrl && (
                  <a 
                    href={evaluation.tonePersona.learnMoreUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Learn more →
                  </a>
                )}
              </div>
              <p className="text-gray-600">{evaluation.tonePersona.feedback}</p>
            </div>
            
            {/* E - Explicit Task */}
            <div className="border border-gray-100 rounded-md p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">E - Explicit Task</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(evaluation.explicitTask.score)}`}>
                    {evaluation.explicitTask.score}
                  </span>
                </div>
                {evaluation.explicitTask.learnMoreUrl && (
                  <a 
                    href={evaluation.explicitTask.learnMoreUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Learn more →
                  </a>
                )}
              </div>
              <p className="text-gray-600">{evaluation.explicitTask.feedback}</p>
            </div>
            
            {/* A - Arrangement of Output */}
            <div className="border border-gray-100 rounded-md p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">A - Arrangement of Output</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(evaluation.arrangementOutput.score)}`}>
                    {evaluation.arrangementOutput.score}
                  </span>
                </div>
                {evaluation.arrangementOutput.learnMoreUrl && (
                  <a 
                    href={evaluation.arrangementOutput.learnMoreUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Learn more →
                  </a>
                )}
              </div>
              <p className="text-gray-600">{evaluation.arrangementOutput.feedback}</p>
            </div>
            
            {/* C - Context & Constraints */}
            <div className="border border-gray-100 rounded-md p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">C - Context & Constraints</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(evaluation.contextConstraints.score)}`}>
                    {evaluation.contextConstraints.score}
                  </span>
                </div>
                {evaluation.contextConstraints.learnMoreUrl && (
                  <a 
                    href={evaluation.contextConstraints.learnMoreUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Learn more →
                  </a>
                )}
              </div>
              <p className="text-gray-600">{evaluation.contextConstraints.feedback}</p>
            </div>
            
            {/* H - Higher Level Refinements */}
            <div className="border border-gray-100 rounded-md p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">H - Higher Level Refinements</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(evaluation.higherLevelRefinements.score)}`}>
                    {evaluation.higherLevelRefinements.score}
                  </span>
                </div>
                {evaluation.higherLevelRefinements.learnMoreUrl && (
                  <a 
                    href={evaluation.higherLevelRefinements.learnMoreUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Learn more →
                  </a>
                )}
              </div>
              <p className="text-gray-600">{evaluation.higherLevelRefinements.feedback}</p>
            </div>
          </div>
        )}
        
        {/* Refinements Tab (or shown at the bottom of the All tab) */}
        <div className={activeTab === 'refinements' ? '' : 'mt-8 pt-6 border-t'}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Suggested Refinements</h3>
            <button 
              onClick={handleCopySuggestions}
              className="px-3 py-1 text-sm bg-gray-100 rounded border hover:bg-gray-200"
              title="Copy suggestions to clipboard"
            >
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            {evaluation.suggestedRefinements.map((refinement, index) => (
              <li key={index} className="text-gray-600">{refinement}</li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="bg-gray-50 border-t p-4 flex justify-end space-x-3">
        <button 
          onClick={handleCopySuggestions}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
        >
          {copied ? 'Copied!' : 'Copy Suggestions'}
        </button>
        <button 
          onClick={() => setActiveTab('refinements')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          View Refinements
        </button>
      </div>
    </div>
  );
} 