import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const schools = db.prepare('SELECT * FROM schools ORDER BY created_at DESC').all();
    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, location, principal_name, phone, email, notes } = await request.json();

    const result = db
      .prepare('INSERT INTO schools (name, location, principal_name, phone, email, notes) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name, location, principal_name, phone, email, notes);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create school' }, { status: 500 });
  }
}
