import { NextRequest, NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nationality, userType, email } = body;
    if (!nationality || !userType || !email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const file = 'special_requests.json';
    const existing = await readJSON<any[]>(file) || [];
    existing.push({ nationality, userType, email, submittedAt: new Date().toISOString() });
    await writeJSON(file, existing);
    return NextResponse.json({ message: 'Saved' });
  } catch (error) {
    console.error('Error saving special request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const file = 'special_requests.json';
    const existing = await readJSON<any[]>(file) || [];
    return NextResponse.json({ submissions: existing });
  } catch (error) {
    console.error('Error reading special requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
