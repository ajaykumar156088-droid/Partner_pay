import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUsers } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const users = await getUsers();

  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalRegularUsers = totalUsers - totalAdmins;

  return NextResponse.json({
    totalBalance,
    totalUsers,
    totalAdmins,
    totalRegularUsers,
  });
}

