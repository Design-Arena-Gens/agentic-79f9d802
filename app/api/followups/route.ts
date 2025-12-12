import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const followups = db
      .prepare(
        `SELECT f.*, m.name as manager_name
         FROM followups f
         LEFT JOIN managers m ON f.manager_id = m.id
         ORDER BY f.created_at DESC`
      )
      .all();
    return NextResponse.json(followups);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch followups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { manager_id, followup_date, status, notes } = await request.json();

    const result = db
      .prepare('INSERT INTO followups (manager_id, followup_date, status, notes) VALUES (?, ?, ?, ?)')
      .run(manager_id, followup_date, status, notes);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create followup' }, { status: 500 });
  }
}
