import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { recipient, subject, body } = await request.json();

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { error: 'تكوين Gmail غير مكتمل. يرجى إعداد GMAIL_USER و GMAIL_APP_PASSWORD في ملف .env' },
        { status: 400 }
      );
    }

    const result = await sendEmail(recipient, subject, body);

    if (result.success) {
      db.prepare('INSERT INTO email_logs (recipient, subject, body) VALUES (?, ?, ?)').run(
        recipient,
        subject,
        body
      );

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'فشل إرسال البريد الإلكتروني' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال البريد الإلكتروني' }, { status: 500 });
  }
}
