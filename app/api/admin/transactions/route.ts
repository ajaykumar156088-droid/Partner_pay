import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readJSON, TransactionsData } from '@/lib/db';

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
  
  const data = await readJSON<TransactionsData>('transactions.json');
  let transactions = data.transactions || [];
  
  if (userId) {
    transactions = transactions.filter(t => t.userId === userId);
  }
  
  // Sort by timestamp descending
  transactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return NextResponse.json({ transactions });
}

