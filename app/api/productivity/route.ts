import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const productivity = db.prepare('SELECT * FROM productivity ORDER BY created_at DESC').all();
    return NextResponse.json(productivity);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch productivity' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { entity_name, entity_type, visits, reports_submitted, score, period } = await request.json();

    const result = db
      .prepare(
        'INSERT INTO productivity (entity_name, entity_type, visits, reports_submitted, score, period) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(entity_name, entity_type, visits, reports_submitted, score, period);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create productivity record' }, { status: 500 });
  }
}
