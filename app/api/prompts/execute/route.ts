import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { executePrompt } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { promptText, userId } = await request.json();
    
    if (!promptText) {
      return NextResponse.json(
        { error: 'Prompt text is required' },
        { status: 400 }
      );
    }
    
    // Call Gemini API to execute the prompt
    const result = await executePrompt(promptText);
    
    // Store result in database if userId is provided
    if (userId) {
      // First find or create the prompt
      const prompt = await prisma.prompt.upsert({
        where: {
          id: userId + '-temp', // This is a placeholder that will be replaced if found
        },
        update: {
          promptText,
          updatedAt: new Date(),
        },
        create: {
          id: userId + '-temp',
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