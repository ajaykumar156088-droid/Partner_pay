import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readJSON, writeJSON, type VouchersData, type UsersData, type TransactionsData } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

// POST - Redeem a voucher by code
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const vouchersData = await readJSON<VouchersData>('vouchers.json');
    const codeLower = code.trim().toLowerCase();

    const voucher = (vouchersData.vouchers || []).find(v => v.code && v.code.toLowerCase() === codeLower && v.status !== 'redeemed');

    if (!voucher) {
      return NextResponse.json({ error: 'Invalid or already redeemed code' }, { status: 404 });
    }

    // If voucher not assigned to a user, assign it to this user
    if (!voucher.userId) {
      voucher.userId = session.userId;
    }

    // Only the assigned user can redeem
    if (voucher.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If pending -> scratched first
    if (voucher.status === 'pending') {
      voucher.status = 'scratched';
      voucher.scratchedAt = new Date().toISOString();
      await writeJSON('vouchers.json', vouchersData);
      return NextResponse.json({ voucher, message: 'Voucher scratched. Redeem to add to balance.' });
    }

    // If scratched -> redeem
    if (voucher.status === 'scratched') {
      const usersData = await readJSON<UsersData>('users.json');
      const user = usersData.users?.find(u => u.id === session.userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      user.balance = (user.balance || 0) + voucher.amount;
      await writeJSON('users.json', usersData);

      const transactionsData = await readJSON<TransactionsData>('transactions.json');
      if (!transactionsData.transactions) transactionsData.transactions = [];
      transactionsData.transactions.push({
        id: uuidv4(),
        userId: session.userId,
        amount: voucher.amount,
        type: 'voucher_redeemed',
        details: `Voucher redeemed via code: ${voucher.code}`,
        timestamp: new Date().toISOString(),
      });
      await writeJSON('transactions.json', transactionsData);

      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date().toISOString();
      await writeJSON('vouchers.json', vouchersData);

      return NextResponse.json({ voucher, message: `Successfully redeemed ₹${voucher.amount}!` });
    }

    return NextResponse.json({ error: 'Invalid voucher state' }, { status: 400 });
  } catch (error) {
    console.error('Error redeeming voucher by code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
