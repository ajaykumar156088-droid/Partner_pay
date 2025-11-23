import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getVoucher, updateVoucher, getUser, updateUser, createTransaction } from '@/lib/db';
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

    const voucher = await getVoucher(id);

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
      const user = await getUser(session.userId);

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update user balance
      user.balance = (user.balance || 0) + voucher.amount;
      await updateUser(user);

      // Create transaction record
      await createTransaction({
        id: uuidv4(),
        userId: session.userId,
        amount: voucher.amount,
        type: 'voucher_redeemed',
        details: `Voucher redeemed: ${voucher.reason}`,
        timestamp: new Date().toISOString(),
      });

      // Update voucher to redeemed
      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date().toISOString();
    }

    await updateVoucher(voucher);

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



