import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { User } from '@prisma/client';

// GET - Retrieve user's prompts
export async function GET(request: Request) {
  // Get the user ID from the query parameters
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
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
    const { promptText, userId } = await request.json();
    
    if (!promptText || !userId) {
      return NextResponse.json(
        { error: 'Prompt text and user ID are required' },
        { status: 400 }
      );
    }
    
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create the prompt
    const prompt = await prisma.prompt.create({
      data: {
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