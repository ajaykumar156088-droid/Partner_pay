import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { getSetting, updateSetting } from '@/lib/db';

export const runtime = 'nodejs';

// GET - Get settings
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

    const link = await getSetting('authentication_link');
    return NextResponse.json({
      authenticationLink: link || 'https://example.com/authenticate'
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
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
    const { authenticationLink } = body;

    if (!authenticationLink || typeof authenticationLink !== 'string') {
      return NextResponse.json({ error: 'Invalid authentication link' }, { status: 400 });
    }

    await updateSetting('authentication_link', authenticationLink.trim());

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: { authenticationLink: authenticationLink.trim() }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



