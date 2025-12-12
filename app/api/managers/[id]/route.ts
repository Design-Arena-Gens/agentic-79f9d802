import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, phone, email, department, notes } = await request.json();

    db.prepare('UPDATE managers SET name = ?, phone = ?, email = ?, department = ?, notes = ? WHERE id = ?').run(
      name,
      phone,
      email,
      department,
      notes,
      params.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update manager' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    db.prepare('DELETE FROM managers WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete manager' }, { status: 500 });
  }
}
