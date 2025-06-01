'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/nextauth';
import AIxLayout from '@/components/AIxLayout';

// Categories derived from weareteachers.com/ai-prompts
const PROMPT_CATEGORIES = [
  'Administrative Tasks',
  'Parent Communication',
  'Professional Development',
  'Lesson Planning',
  'Instructional Materials',
  'Assessment and Review'
];

const GRADE_LEVELS = [
  'Elementary School',
  'Middle School',
  'High School',
  'All Grades'
];

const PROMPT_TYPES = [
  'Email Templates',
  'School Newsletter',
  'School Forms',
  'Data Analytics',
  'Flash Cards',
  'Exit Tickets',
  'Writing Prompts',
  'Standards Alignment',
  'Report Card Comments',
  'Lesson Plans',
  'Quizzes and Tests'
];

// Collection of prompts based on weareteachers.com/ai-prompts
const TEACHER_PROMPTS = [
  {
    title: "Welcome Email to Parents",
    text: "You are a kindergarten teacher welcoming new students and their parents at the beginning of the school year. Create an email that introduces yourself and discusses classroom goals, what the children can expect during the year, and how parents can stay engaged in their child's education.",
    category: "Administrative Tasks",
    gradeLevel: "Elementary School",
    type: "Email Templates"
  },
  {
    title: "Student Progress Concern Email",
    text: "You are an elementary school teacher who has noticed a student struggling academically and socially. Write an email to the parents to schedule a meeting, making sure to express concern, provide observations, and invite collaboration on strategies to support the student.",
    category: "Parent Communication",
    gradeLevel: "Elementary School",
    type: "Email Templates"
  },
  {
    title: "Standardized Test Preparation Email",
    text: "You are a middle school teacher who needs to inform parents about upcoming standardized tests. Write an email explaining the test schedule, the importance of these tests, and how parents can help their children prepare.",
    category: "Parent Communication",
    gradeLevel: "Middle School",
    type: "Email Templates"
  },
  {
    title: "Field Trip Permission Form",
    text: "You are a teacher planning a field trip to a local museum. Write instructions for a field trip permission form that explains the purpose of the visit, transportation details, what students should bring, and safety measures in place.",
    category: "Administrative Tasks",
    gradeLevel: "All Grades",
    type: "School Forms"
  },
  {
    title: "Monthly School Newsletter Principal Message",
    text: "You are a principal preparing the monthly school newsletter. Write a welcoming message that highlights the achievements of the past month and outlines key events coming up.",
    category: "Administrative Tasks",
    gradeLevel: "All Grades",
    type: "School Newsletter"
  },
  {
    title: "Elementary Math Flash Cards",
    text: "Create math flash cards for addition and subtraction facts. Each card should display a problem on one side and the answer on the other, designed to help students quickly recall basic arithmetic.",
    category: "Instructional Materials",
    gradeLevel: "Elementary School",
    type: "Flash Cards"
  },
  {
    title: "Periodic Table Flash Cards",
    text: "You are a middle school science teacher creating flash cards for a unit on the periodic table. Each card should feature an element's symbol on one side and its atomic number, atomic mass, and uses on the other side.",
    category: "Instructional Materials",
    gradeLevel: "Middle School",
    type: "Flash Cards"
  },
  {
    title: "Butterfly Life Cycle Exit Ticket",
    text: "Develop an exit ticket for a lesson on the life cycle of butterflies. Ask students to list the four main stages of the butterfly life cycle in order.",
    category: "Assessment and Review",
    gradeLevel: "Elementary School",
    type: "Exit Tickets"
  },
  {
    title: "American Revolution Exit Ticket",
    text: "You are a middle school teacher wrapping up a lesson on the causes of the American Revolution. Design an exit ticket that asks students to write one sentence summarizing why the American Revolution started.",
    category: "Assessment and Review",
    gradeLevel: "Middle School",
    type: "Exit Tickets"
  },
  {
    title: "Macbeth Character Analysis Exit Ticket",
    text: "You are a high school teacher finishing a lesson on Shakespeare's 'Macbeth.' Prepare an exit ticket that asks students to describe Macbeth's character in one sentence based on what they learned.",
    category: "Assessment and Review",
    gradeLevel: "High School",
    type: "Exit Tickets"
  },
  {
    title: "Elementary Science Lesson Plan",
    text: "Create a detailed 5th-grade science lesson plan about ecosystems. Include learning objectives, materials needed, step-by-step activities, assessment strategies, and extension ideas. The lesson should be 45 minutes long and aligned with Next Generation Science Standards.",
    category: "Lesson Planning",
    gradeLevel: "Elementary School",
    type: "Lesson Plans"
  },
  {
    title: "Middle School History Lesson Plan",
    text: "Create a lesson plan for an 8th-grade American history class on the Civil Rights Movement. Include learning objectives, a timeline activity, primary source analysis, discussion questions, and an assessment strategy.",
    category: "Lesson Planning",
    gradeLevel: "Middle School",
    type: "Lesson Plans"
  },
  {
    title: "High School Biology Quiz",
    text: "Create a 10-question quiz on photosynthesis for high school biology students. Include a mix of multiple-choice, fill-in-the-blank, and short-answer questions. Provide an answer key with explanations.",
    category: "Assessment and Review",
    gradeLevel: "High School",
    type: "Quizzes and Tests"
  },
  {
    title: "Environmental Writing Prompts",
    text: "Generate 5 creative writing prompts for middle school students that encourage critical thinking about environmental issues. Each prompt should be 2-3 sentences and include a scenario, character, and conflict.",
    category: "Instructional Materials",
    gradeLevel: "Middle School",
    type: "Writing Prompts"
  },
  {
    title: "Student Essay Feedback",
    text: "Generate constructive feedback for a student essay that needs improvement in organization and evidence. The feedback should be specific, actionable, and encouraging. Include at least 3 strengths and 3 areas for improvement.",
    category: "Assessment and Review",
    gradeLevel: "High School",
    type: "Report Card Comments"
  },
  {
    title: "Math Standards Alignment",
    text: "You are an elementary school teacher aligning your mathematics curriculum with Common Core standards. Create a unit plan that includes activities and assessments for teaching basic fractions, ensuring each component meets specific standard requirements.",
    category: "Lesson Planning",
    gradeLevel: "Elementary School",
    type: "Standards Alignment"
  },
  {
    title: "High School Weather Data Analysis",
    text: "You are a high school social studies teacher. Assign students to analyze census data related to demographic changes over the last decade. They should prepare a report discussing the trends and potential implications for society.",
    category: "Instructional Materials",
    gradeLevel: "High School",
    type: "Data Analytics"
  },
  {
    title: "Professional Development Plan",
    text: "Create a personalized professional development plan for a 5th-grade teacher looking to improve technology integration in the classroom. Include goals, resources, timeline, and methods of measuring success.",
    category: "Professional Development",
    gradeLevel: "Elementary School",
    type: "Professional Development"
  },
  {
    title: "Parent-Teacher Conference Script",
    text: "Create a script for a parent-teacher conference about a student who is excelling academically but struggling socially. Include talking points, potential parent questions, and collaborative solution suggestions.",
    category: "Parent Communication",
    gradeLevel: "Middle School",
    type: "Parent Communication"
  },
  {
    title: "Shakespeare Analysis Essay Prompt",
    text: "You are a high school teacher asking your students to write an analytical essay on the theme of power and corruption as seen in Shakespeare's 'Macbeth.' Encourage them to discuss how the theme is developed through the plot and characters.",
    category: "Instructional Materials",
    gradeLevel: "High School",
    type: "Writing Prompts"
  }
];

export default function ExamplePrompts() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [promptType, setPromptType] = useState('');
  const [page, setPage] = useState(1);
  const [filteredPrompts, setFilteredPrompts] = useState(TEACHER_PROMPTS);
  const promptsPerPage = 5;
  
  // Apply filters when any filter changes
  useEffect(() => {
    const filtered = TEACHER_PROMPTS.filter(prompt => {
      // Apply category filter
      if (category && prompt.category !== category) return false;
      
      // Apply grade level filter
      if (gradeLevel && prompt.gradeLevel !== gradeLevel && prompt.gradeLevel !== 'All Grades') return false;
      
      // Apply prompt type filter
      if (promptType && prompt.type !== promptType) return false;
      
      // Apply search filter
      if (search) {
        const searchTerm = search.toLowerCase();
        return (
          prompt.title.toLowerCase().includes(searchTerm) ||
          prompt.text.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
    
    setFilteredPrompts(filtered);
    setPage(1); // Reset to first page when filters change
  }, [search, category, gradeLevel, promptType]);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
    alert('Prompt copied to clipboard');
  };
  
  const usePrompt = (text: string) => {
    // If user isn't logged in, send to sign-in page
    if (!user) {
      localStorage.setItem('selectedPrompt', text);
      router.push('/auth/signin');
      return;
    }
    
    // If user is logged in, go to promptcraft-analyzer with the prompt
    localStorage.setItem('selectedPrompt', text);
    router.push('/promptcraft-analyzer');
  };
  
  // Calculate total pages and current page's prompts
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
  const currentPrompts = filteredPrompts.slice(
    (page - 1) * promptsPerPage,
    page * promptsPerPage
  );
  
  return (
    <AIxLayout
      title="Example Prompts"
      subtitle="Browse these example prompts to get started with AI PromptCraft"
    >
      <div className="flex items-center justify-end mb-6">
        <Link
          href="/example-prompts/test-gemini"
          className="px-4 py-2 bg-aixblue-600 hover:bg-aixblue-700 text-white rounded-md font-medium"
        >
          Test Gemini API
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Browse through our collection of AI prompts for teachers. Filter by category, grade level, and type to find the perfect prompt for your needs.
          </p>
          
          {/* Source Attribution */}
          <div className="mb-6 bg-aixblue-50 p-4 rounded-lg border border-aixblue-100">
            <p className="text-sm text-aixblue-800">
              These prompts are curated from <a href="https://www.weareteachers.com/ai-prompts/" target="_blank" rel="noopener noreferrer" className="text-aixblue-600 hover:underline font-medium">WeAreTeachers.com</a> which offers 300+ AI prompts for K-12 educators. This page shows a sample selection - visit their website for the complete collection.
            </p>
          </div>
          
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search prompts..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-aixblue-500 focus:border-aixblue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-aixblue-500 focus:border-aixblue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {PROMPT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
              <select
                id="gradeLevel"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-aixblue-500 focus:border-aixblue-500"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
              >
                <option value="">All Grade Levels</option>
                {GRADE_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="promptType" className="block text-sm font-medium text-gray-700 mb-1">Prompt Type</label>
              <select
                id="promptType"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-aixblue-500 focus:border-aixblue-500"
                value={promptType}
                onChange={(e) => setPromptType(e.target.value)}
              >
                <option value="">All Types</option>
                {PROMPT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredPrompts.length} prompts
            {category && ` in ${category}`}
            {gradeLevel && ` for ${gradeLevel}`}
            {promptType && ` of type ${promptType}`}
            {search && ` matching "${search}"`}
          </div>
          
          {/* Prompts List */}
          <div className="grid gap-4 mt-6">
            {currentPrompts.length > 0 ? (
              currentPrompts.map((prompt, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-4 hover:border-aixblue-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{prompt.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-aixblue-50 text-aixblue-800 rounded-full">
                          {prompt.category}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-aixindigo-50 text-aixindigo-800 rounded-full">
                          {prompt.gradeLevel}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {prompt.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3 sm:mt-0">
                      <button
                        onClick={() => copyToClipboard(prompt.text)}
                        className="px-3 py-1 text-sm font-medium border rounded hover:bg-gray-50"
                        title="Copy to clipboard"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => usePrompt(prompt.text)}
                        className="px-3 py-1 text-sm font-medium bg-aixblue-600 text-white rounded hover:bg-aixblue-700"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className={`mt-3 ${selectedPrompt === prompt.text ? 'block' : 'line-clamp-3'} text-gray-600`}
                  >
                    {prompt.text}
                  </div>
                  
                  {prompt.text.length > 150 && (
                    <button
                      onClick={() => setSelectedPrompt(selectedPrompt === prompt.text ? null : prompt.text)}
                      className="text-aixblue-600 hover:text-aixblue-800 text-sm mt-2 font-medium"
                    >
                      {selectedPrompt === prompt.text ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No prompts found matching your filters. Try adjusting your criteria.</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded ${page === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-aixblue-600 hover:bg-aixblue-50'}`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-full ${pageNum === page 
                      ? 'bg-aixblue-600 text-white' 
                      : 'text-gray-700 hover:bg-aixblue-50'}`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded ${page === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-aixblue-600 hover:bg-aixblue-50'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </AIxLayout>
  );
} 