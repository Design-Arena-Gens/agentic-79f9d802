import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const reports = db.prepare('SELECT * FROM reports ORDER BY created_at DESC').all();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, inspector_name, report_date, report_type } = await request.json();

    const result = db
      .prepare(
        'INSERT INTO reports (title, content, inspector_name, report_date, report_type) VALUES (?, ?, ?, ?, ?)'
      )
      .run(title, content, inspector_name, report_date, report_type);

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
