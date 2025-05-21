import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    if (!userData.id || !userData.email) {
      return NextResponse.json({ error: 'Missing required user data' }, { status: 400 });
    }
    
    // Find user or create a new one
    const user = await prisma.user.upsert({
      where: { 
        id: userData.id 
      },
      update: {
        name: userData.name,
        email: userData.email,
        image: userData.image,
        updatedAt: new Date(),
      },
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        image: userData.image,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    return NextResponse.json({ 
      message: 'User data saved successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image
      } 
    });
  } catch (error) {
    console.error('Error saving user data:', error);
    return NextResponse.json({ error: 'Failed to save user data' }, { status: 500 });
  }
} 