import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { manager_id, followup_date, status, notes } = await request.json();

    db.prepare('UPDATE followups SET manager_id = ?, followup_date = ?, status = ?, notes = ? WHERE id = ?').run(
      manager_id,
      followup_date,
      status,
      notes,
      params.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update followup' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    db.prepare('DELETE FROM followups WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete followup' }, { status: 500 });
  }
}
