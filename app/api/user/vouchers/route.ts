import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getUserVouchers } from '@/lib/db';

export const runtime = 'nodejs';

// GET - Get current user's vouchers
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vouchers = await getUserVouchers(session.userId);

    return NextResponse.json({ vouchers });
  } catch (error) {
    console.error('Error fetching user vouchers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



