import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { readJSON, writeJSON, type UsersData, type SettingsData } from '@/lib/db';

export const runtime = 'nodejs';

// GET - Get authentication link
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

    const settings = await readJSON<SettingsData>('settings.json');
    return NextResponse.json({ 
      authenticationLink: settings.authenticationLink || 'https://example.com/authenticate'
    });
  } catch (error) {
    console.error('Error fetching authentication link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Update user authentication status
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
    const { status } = body;

    if (status !== 'pending' && status !== 'authenticated') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const usersData = await readJSON<UsersData>('users.json');
    const user = usersData.users?.find(u => u.id === session.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.authenticationStatus = status;
    if (status === 'authenticated') {
      user.authenticatedAt = new Date().toISOString();
    }

    await writeJSON('users.json', usersData);

    return NextResponse.json({ 
      message: 'Authentication status updated',
      user: {
        id: user.id,
        email: user.email,
        balance: user.balance,
        authenticationStatus: user.authenticationStatus,
        authenticatedAt: user.authenticatedAt
      }
    });
  } catch (error) {
    console.error('Error updating authentication status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



