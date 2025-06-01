import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { evaluatePrompt } from '@/lib/gemini';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { generateUniquePromptId } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { promptText } = await request.json();
    
    if (!promptText) {
      return NextResponse.json(
        { error: 'Prompt text is required' },
        { status: 400 }
      );
    }
    
    // Get the authenticated user from the session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Call Gemini API to evaluate the prompt
    const evaluation = await evaluatePrompt(promptText);
    
    // Store evaluation in database if user is authenticated
    if (userId) {
      try {
        // Generate a unique ID using userId and timestamp
        const uniquePromptId = generateUniquePromptId(userId);
        
        // Create a new prompt with the unique ID
        const prompt = await prisma.prompt.create({
          data: {
            id: uniquePromptId,
            userId,
            promptText,
          },
        });
        
        // Then create the evaluation linked to the prompt
        await prisma.promptEvaluation.create({
          data: {
            evaluationData: evaluation,
            promptId: prompt.id,
          },
        });
        
        console.log(`Created prompt with ID: ${prompt.id} and linked evaluation`);
      } catch (dbError) {
        console.error('Database error saving evaluation:', dbError);
        // Continue even if DB operation fails - return the evaluation to the user
      }
    }
    
    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error('Error evaluating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate prompt', details: (error as Error).message },
      { status: 500 }
    );
  }
} 