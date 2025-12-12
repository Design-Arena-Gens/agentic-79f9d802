import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, description, appointment_date, location, attendees, status } = await request.json();

    db.prepare(
      'UPDATE appointments SET title = ?, description = ?, appointment_date = ?, location = ?, attendees = ?, status = ? WHERE id = ?'
    ).run(title, description, appointment_date, location, attendees, status, params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    db.prepare('DELETE FROM appointments WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}
