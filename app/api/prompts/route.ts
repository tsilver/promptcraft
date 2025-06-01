import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { generateUniquePromptId } from '@/lib/utils';
import type { User } from '@prisma/client';

// GET - Retrieve user's prompts
export async function GET(request: Request) {
  // Get the user from the session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized - Please sign in' },
      { status: 401 }
    );
  }
  
  const userId = session.user.id;
  
  try {
    // Retrieve the user's prompts
    const prompts = await prisma.prompt.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        evaluations: {
          take: 1,
          orderBy: {
            evaluatedAt: 'desc',
          },
        },
        results: {
          take: 1,
          orderBy: {
            generatedAt: 'desc',
          },
        },
      },
    });
    
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error retrieving prompts:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve prompts' },
      { status: 500 }
    );
  }
}

// POST - Create a new prompt
export async function POST(request: Request) {
  try {
    const { promptText } = await request.json();
    
    if (!promptText) {
      return NextResponse.json(
        { error: 'Prompt text is required' },
        { status: 400 }
      );
    }
    
    // Get the user from the session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Generate a unique ID for the prompt
    const uniquePromptId = generateUniquePromptId(userId);
    
    // Create the prompt
    const prompt = await prisma.prompt.create({
      data: {
        id: uniquePromptId,
        promptText,
        userId,
      },
    });
    
    return NextResponse.json({
      message: 'Prompt created successfully',
      promptId: prompt.id,
    });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing prompt
export async function PUT(request: Request) {
  try {
    const { promptId, promptText, isFavorite } = await request.json();
    
    if (!promptId) {
      return NextResponse.json(
        { error: 'Prompt ID is required' },
        { status: 400 }
      );
    }
    
    // Update the prompt
    const prompt = await prisma.prompt.update({
      where: {
        id: promptId,
      },
      data: {
        ...(promptText && { promptText }),
        ...(isFavorite !== undefined && { isFavorite }),
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json({
      message: 'Prompt updated successfully',
      promptId: prompt.id,
    });
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a prompt
export async function DELETE(request: Request) {
  // Get the prompt ID from the query parameters
  const { searchParams } = new URL(request.url);
  const promptId = searchParams.get('promptId');
  
  if (!promptId) {
    return NextResponse.json(
      { error: 'Prompt ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Delete the prompt (this will cascade to evaluations and results)
    await prisma.prompt.delete({
      where: {
        id: promptId,
      },
    });
    
    return NextResponse.json({
      message: 'Prompt deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
} 