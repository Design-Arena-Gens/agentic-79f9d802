import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const logs = db.prepare('SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 50').all();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch email logs' }, { status: 500 });
  }
}
