import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readJSON, writeJSON, type VouchersData, type UsersData, type TransactionsData } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

// POST - Scratch and redeem voucher
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const vouchersData = await readJSON<VouchersData>('vouchers.json');
    const voucher = vouchersData.vouchers?.find(v => v.id === id);

    if (!voucher) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    }

    if (voucher.userId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (voucher.status === 'redeemed') {
      return NextResponse.json({ error: 'Voucher already redeemed' }, { status: 400 });
    }

    // Update voucher status
    if (voucher.status === 'pending') {
      voucher.status = 'scratched';
      voucher.scratchedAt = new Date().toISOString();
    } else if (voucher.status === 'scratched') {
      // Redeem the voucher - add amount to user balance
      const usersData = await readJSON<UsersData>('users.json');
      const user = usersData.users?.find(u => u.id === session.userId);
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update user balance
      user.balance = (user.balance || 0) + voucher.amount;
      await writeJSON('users.json', usersData);

      // Create transaction record
      const transactionsData = await readJSON<TransactionsData>('transactions.json');
      if (!transactionsData.transactions) {
        transactionsData.transactions = [];
      }
      transactionsData.transactions.push({
        id: uuidv4(),
        userId: session.userId,
        amount: voucher.amount,
        type: 'voucher_redeemed',
        details: `Voucher redeemed: ${voucher.reason}`,
        timestamp: new Date().toISOString(),
      });
      await writeJSON('transactions.json', transactionsData);

      // Update voucher to redeemed
      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date().toISOString();
    }

    await writeJSON('vouchers.json', vouchersData);

    return NextResponse.json({ 
      voucher,
      message: voucher.status === 'redeemed' 
        ? `Successfully redeemed ₹${voucher.amount}!` 
        : 'Voucher scratched successfully!'
    });
  } catch (error) {
    console.error('Error scratching voucher:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



