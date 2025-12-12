import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    db.prepare('DELETE FROM reports WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
