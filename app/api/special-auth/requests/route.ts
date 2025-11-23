import { NextRequest, NextResponse } from 'next/server';
import { createSpecialRequest, getSpecialRequests, getUserByEmail, getUser, updateUser } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nationality, userType, email } = body;
    if (!nationality || !userType || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    await createSpecialRequest({ nationality, user_type: userType, email, submittedAt: new Date().toISOString() });

    // Update user status to pending
    // Update user status to pending
    // Try to get user from session first (more reliable)
    const token = request.cookies.get('session')?.value;
    let user = null;

    if (token) {
      const session = await verifySession(token);
      if (session?.userId) {
        user = await getUser(session.userId);
      }
    }

    // Fallback to email if no session or user not found
    if (!user) {
      user = await getUserByEmail(email);
    }

    if (user) {
      user.authenticationStatus = 'pending';
      await updateUser(user);
    }

    return NextResponse.json({ message: 'Saved' });
  } catch (error) {
    console.error('Error saving special request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const existing = await getSpecialRequests();
    return NextResponse.json({ submissions: existing });
  } catch (error) {
    console.error('Error reading special requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
