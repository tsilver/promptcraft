import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executePrompt } from '@/lib/gemini';
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
    
    // Call Gemini API to execute the prompt
    const result = await executePrompt(promptText);
    
    // Store result in database if user is authenticated
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
        
        // Then create the result linked to the prompt
        await prisma.promptResult.create({
          data: {
            resultText: result,
            promptId: prompt.id,
          },
        });
        
        console.log(`Created prompt with ID: ${prompt.id} and linked result`);
      } catch (dbError) {
        console.error('Database error saving prompt result:', dbError);
        // Continue even if DB operation fails - return the result to the user
      }
    }
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error executing prompt:', error);
    return NextResponse.json(
      { error: 'Failed to execute prompt', details: (error as Error).message },
      { status: 500 }
    );
  }
} 