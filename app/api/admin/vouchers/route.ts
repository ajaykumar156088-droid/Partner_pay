import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readJSON, writeJSON, type VouchersData, type UsersData, type TransactionsData } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

// GET - List all vouchers or filter by userId
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const vouchersData = await readJSON<VouchersData>('vouchers.json');
    let vouchers = vouchersData.vouchers || [];

    if (userId) {
      vouchers = vouchers.filter(v => v.userId === userId);
    }

    // Sort by creation date (newest first)
    vouchers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new voucher
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, amount, reason } = body;

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid request. userId and positive amount are required.' }, { status: 400 });
    }

    // Verify user exists
    const usersData = await readJSON<UsersData>('users.json');
    const user = usersData.users?.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create voucher
    const voucher = {
      id: uuidv4(),
      userId,
      amount: parseFloat(amount),
      reason: reason || 'Voucher from admin',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      createdBy: session.userId,
    };

    const vouchersData = await readJSON<VouchersData>('vouchers.json');
    if (!vouchersData.vouchers) {
      vouchersData.vouchers = [];
    }
    vouchersData.vouchers.push(voucher);
    await writeJSON('vouchers.json', vouchersData);

    return NextResponse.json({ voucher }, { status: 201 });
  } catch (error) {
    console.error('Error creating voucher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



