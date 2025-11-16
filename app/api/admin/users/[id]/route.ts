import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readJSON, writeJSON, UsersData, User } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

export const runtime = 'nodejs';

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  balance: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { id } = await params;
  const data = await readJSON<UsersData>('users.json');
  const user = data.users?.find(u => u.id === id);
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  const { password, ...userWithoutPassword } = user;
  return NextResponse.json({ user: userWithoutPassword });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { id } = await params;
    const body = await request.json();
    const updates = updateUserSchema.parse(body);
    
    const data = await readJSON<UsersData>('users.json');
    const users = data.users || [];
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const user = users[userIndex];
    
    if (updates.email && updates.email !== user.email) {
      // Check if email is already taken
      if (users.find(u => u.email === updates.email && u.id !== id)) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
      user.email = updates.email;
    }
    
    if (updates.password) {
      user.password = await hashPassword(updates.password);
    }
    
    if (updates.balance !== undefined) {
      user.balance = updates.balance;
    }
    
    await writeJSON<UsersData>('users.json', { users });
    
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { id } = await params;
  const data = await readJSON<UsersData>('users.json');
  const users = data.users || [];
  const filteredUsers = users.filter(u => u.id !== id);
  
  if (filteredUsers.length === users.length) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  await writeJSON<UsersData>('users.json', { users: filteredUsers });
  return NextResponse.json({ success: true });
}

