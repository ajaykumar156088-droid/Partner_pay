import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readJSON, writeJSON, type UsersData } from '@/lib/db';

export const runtime = 'nodejs';

// GET - Get all pending authentication requests
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

    const usersData = await readJSON<UsersData>('users.json');
    const pendingUsers = (usersData.users || []).filter(
      u => u.role === 'user' && u.authenticationStatus === 'pending' && (u.balance || 0) >= 1000
    );

    return NextResponse.json({ users: pendingUsers });
  } catch (error) {
    console.error('Error fetching pending authentications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Approve or reject authentication request
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
    const { userId, action } = body; // action: 'approve' or 'reject'

    if (!userId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const usersData = await readJSON<UsersData>('users.json');
    const user = usersData.users?.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'approve') {
      user.authenticationStatus = 'authenticated';
      user.authenticatedAt = new Date().toISOString();
    } else if (action === 'reject') {
      user.authenticationStatus = undefined;
      user.authenticatedAt = undefined;
    }

    await writeJSON('users.json', usersData);

    return NextResponse.json({
      message: `Authentication ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      user: {
        id: user.id,
        email: user.email,
        authenticationStatus: user.authenticationStatus,
        authenticatedAt: user.authenticatedAt
      }
    });
  } catch (error) {
    console.error('Error processing authentication:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


