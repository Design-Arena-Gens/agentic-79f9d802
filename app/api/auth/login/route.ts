import { NextRequest, NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

initDB();

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
