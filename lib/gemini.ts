/**
 * Utility functions for interacting with the Gemini 2.0 Flash API
 */

// Check if environment variables are available
const apiKey = process.env.GEMINI_KEY;
const apiUrl = process.env.GOOGLE_AI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Calls the Gemini API to generate content based on a prompt
 */
export async function generateContent(prompt: string) {
  if (!apiKey) {
    throw new Error('Google AI API key is missing');
  }

  const url = `${apiUrl}?key=${apiKey}`;
  
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

/**
 * Evaluates a prompt using the Gemini API
 * Returns structured evaluation data
 */
export async function evaluatePrompt(promptText: string) {
  const evaluationPrompt = `
You are an AI Prompt Engineering expert. Please evaluate the following prompt based on these criteria:
1. Tone & Persona: Is the tone clear and appropriate? Is there a specific persona defined?
2. Task Clarity: Is the task or request clearly specified?
3. Format & Output: Are format requirements and output expectations clear?
4. Context & Background: Is sufficient context or background information provided?

For each criterion, provide:
- A score: "Excellent", "Good", "Needs Improvement", or "Poor"
- Specific feedback with actionable advice

Also include 3-5 specific refinement suggestions to improve the prompt.

FORMAT YOUR RESPONSE AS JSON:
{
  "tonePersona": {
    "score": "score here",
    "feedback": "feedback here"
  },
  "taskClarity": {
    "score": "score here",
    "feedback": "feedback here"
  },
  "formatOutput": {
    "score": "score here",
    "feedback": "feedback here"
  },
  "contextBackground": {
    "score": "score here",
    "feedback": "feedback here"
  },
  "suggestedRefinements": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

THE PROMPT TO EVALUATE IS: "${promptText}"
`;

  try {
    const responseText = await generateContent(evaluationPrompt);
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from API response');
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error evaluating prompt:', error);
    throw error;
  }
}

/**
 * Executes a prompt using the Gemini API
 * Returns the raw response text
 */
export async function executePrompt(promptText: string) {
  try {
    return await generateContent(promptText);
  } catch (error) {
    console.error('Error executing prompt:', error);
    throw error;
  }
} 