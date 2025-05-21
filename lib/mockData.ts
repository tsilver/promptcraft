/**
 * Mock data for simulating responses when users are not logged in
 */

// Mock evaluation response
export const mockEvaluation = {
  tonePersona: {
    score: "Good",
    feedback: "The tone is professional and clear. Consider defining a specific persona or voice for more consistent communication."
  },
  taskClarity: {
    score: "Good",
    feedback: "The task is well-specified but could benefit from more explicit instructions on the expected outcome."
  },
  formatOutput: {
    score: "Needs Improvement",
    feedback: "The prompt lacks specific format requirements. Consider specifying exactly how you want the output structured."
  },
  contextBackground: {
    score: "Good",
    feedback: "You've provided adequate context, but additional background information could enhance the AI's understanding."
  },
  suggestedRefinements: [
    "Add specific format requirements (e.g., 'Respond with a bullet-point list' or 'Structure the response as a table')",
    "Specify the intended audience to help calibrate the complexity level of the response",
    "Include explicit examples of what a good response should look like",
    "Define a clear persona for the AI to adopt in its response",
    "Include word or length constraints if applicable"
  ]
};

// Mock execution/result response
export const mockExecutionResult = 
`# AI Response to Your Prompt

Based on your request, here's a structured response that addresses the key points:

## Main Points

1. The AI has successfully processed your prompt
2. This is a simulated response since you're not logged in
3. Real responses will be generated when you sign in with Google

## Benefits of Signing In

- Your prompts will be saved for future reference
- Get personalized AI responses based on your actual prompts
- Track your prompt history and improvements over time

## Example Output

\`\`\`
{
  "status": "success",
  "message": "This is a simulated response",
  "logged_in": false
}
\`\`\`

To access the full functionality, please sign in using the Google login option in the top navigation bar.`;

// Login promotion message
export const loginPromotionMessage = 
"👋 You're currently using AI PromptCraft in demo mode. To save your prompts, access personalized evaluations, and get real AI-generated responses, please sign in with your Google account."; 