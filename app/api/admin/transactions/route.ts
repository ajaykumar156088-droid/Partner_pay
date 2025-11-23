import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getTransactions, getUserTransactions } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  let transactions;

  if (userId) {
    transactions = await getUserTransactions(userId);
  } else {
    transactions = await getTransactions();
  }

  return NextResponse.json({ transactions });
}

