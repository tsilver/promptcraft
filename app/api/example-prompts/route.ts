import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

// GET - Retrieve all example prompts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const gradeLevel = searchParams.get('gradeLevel');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    
    // Build filter based on query parameters
    const filter: any = {
      isActive: true,
    };
    
    if (category) filter.category = category;
    if (gradeLevel) filter.gradeLevel = gradeLevel;
    if (type) filter.type = type;
    if (search) {
      filter.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { text: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Get example prompts
    const examplePrompts = await prisma.examplePrompt.findMany({
      where: filter,
      orderBy: {
        useCount: 'desc',
      },
    });
    
    return NextResponse.json({ examplePrompts });
  } catch (error) {
    console.error('Error retrieving example prompts:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve example prompts' },
      { status: 500 }
    );
  }
}

// POST - Create a new example prompt
export async function POST(request: Request) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // TODO: Add admin role check
    
    const { title, text, category, gradeLevel, type } = await request.json();
    
    if (!title || !text || !category || !gradeLevel || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create example prompt
    const examplePrompt = await prisma.examplePrompt.create({
      data: {
        title,
        text,
        category,
        gradeLevel,
        type,
      },
    });
    
    return NextResponse.json({
      message: 'Example prompt created successfully',
      examplePromptId: examplePrompt.id,
    });
  } catch (error) {
    console.error('Error creating example prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create example prompt' },
      { status: 500 }
    );
  }
}

// PUT - Update an example prompt's use count
export async function PUT(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Example prompt ID is required' },
        { status: 400 }
      );
    }
    
    // Increment the prompt's use count
    const examplePrompt = await prisma.examplePrompt.update({
      where: { id },
      data: {
        useCount: {
          increment: 1,
        },
      },
    });
    
    return NextResponse.json({
      message: 'Example prompt use count updated',
      useCount: examplePrompt.useCount,
    });
  } catch (error) {
    console.error('Error updating example prompt use count:', error);
    return NextResponse.json(
      { error: 'Failed to update example prompt use count' },
      { status: 500 }
    );
  }
} 