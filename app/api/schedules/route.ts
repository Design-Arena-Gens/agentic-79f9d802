import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const schedules = db.prepare('SELECT * FROM sending_schedules ORDER BY scheduled_date DESC').all();
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { recipient, subject, content, scheduled_date } = await request.json();

    const result = db
      .prepare('INSERT INTO sending_schedules (recipient, subject, content, scheduled_date) VALUES (?, ?, ?, ?)')
      .run(recipient, subject, content, scheduled_date);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}
