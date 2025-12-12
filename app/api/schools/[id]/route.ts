import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, location, principal_name, phone, email, notes } = await request.json();

    db.prepare(
      'UPDATE schools SET name = ?, location = ?, principal_name = ?, phone = ?, email = ?, notes = ? WHERE id = ?'
    ).run(name, location, principal_name, phone, email, notes, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update school' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    db.prepare('DELETE FROM schools WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete school' }, { status: 500 });
  }
}
