import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUsers, createUser, getUserByEmail, User } from '@/lib/db';
import { hashPassword } from '@/lib/auth-node';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const runtime = 'nodejs';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'user']),
});

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const usersList = await getUsers();
  const users = usersList.map(({ password, ...user }) => user);

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, role } = createUserSchema.parse(body);

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      role: role as 'admin' | 'user',
      balance: 0,
    };

    await createUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

