import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readJSON, TransactionsData } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const data = await readJSON<TransactionsData>('transactions.json');
  const transactions = (data.transactions || [])
    .filter(t => t.userId === session.userId)
    .sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  
  return NextResponse.json({ transactions });
}

