import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const managers = db.prepare('SELECT * FROM managers ORDER BY created_at DESC').all();
    return NextResponse.json(managers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch managers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, department, notes } = await request.json();

    const result = db
      .prepare('INSERT INTO managers (name, phone, email, department, notes) VALUES (?, ?, ?, ?, ?)')
      .run(name, phone, email, department, notes);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create manager' }, { status: 500 });
  }
}
