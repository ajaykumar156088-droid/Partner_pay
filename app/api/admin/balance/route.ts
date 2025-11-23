import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUser, updateUser, createTransaction, Transaction } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const runtime = 'nodejs';

const balanceSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().positive(),
  type: z.enum(['add', 'deduct']),
  details: z.string().optional(),
});

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
    const { userId, amount, type, details } = balanceSchema.parse(body);

    const user = await getUser(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (type === 'add') {
      user.balance += amount;
    } else {
      if (user.balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }
      user.balance -= amount;
    }

    await updateUser(user);

    const transaction: Transaction = {
      id: uuidv4(),
      userId,
      amount: type === 'add' ? amount : -amount,
      type: type === 'add' ? 'admin_add' : 'admin_deduct',
      details: details || `Admin ${type === 'add' ? 'added' : 'deducted'} balance`,
      timestamp: new Date().toISOString(),
    };

    await createTransaction(transaction);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Balance update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

