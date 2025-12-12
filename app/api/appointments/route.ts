import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const appointments = db.prepare('SELECT * FROM appointments ORDER BY appointment_date DESC').all();
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, appointment_date, location, attendees, status } = await request.json();

    const result = db
      .prepare(
        'INSERT INTO appointments (title, description, appointment_date, location, attendees, status) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(title, description, appointment_date, location, attendees, status);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
