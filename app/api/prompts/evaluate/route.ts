import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { evaluatePrompt } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { promptText, userId } = await request.json();
    
    if (!promptText) {
      return NextResponse.json(
        { error: 'Prompt text is required' },
        { status: 400 }
      );
    }
    
    // Call Gemini API to evaluate the prompt
    const evaluation = await evaluatePrompt(promptText);
    
    // Store evaluation in database if userId is provided
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
      
      // Then create the evaluation linked to the prompt
      await prisma.promptEvaluation.create({
        data: {
          evaluationData: evaluation,
          promptId: prompt.id,
        },
      });
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