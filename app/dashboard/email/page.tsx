'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Mail, Send } from 'lucide-react';
import Link from 'next/link';

interface EmailLog {
  id: number;
  recipient: string;
  subject: string;
  sent_at: string;
  status: string;
}

export default function EmailPage() {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    body: '',
  });

  useEffect(() => {
    fetchEmailLogs();
  }, []);

  const fetchEmailLogs = async () => {
    const res = await fetch('/api/email/logs');
    const data = await res.json();
    setEmailLogs(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage({ type: '', text: '' });

    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setSending(false);

    if (res.ok) {
      setMessage({ type: 'success', text: 'تم إرسال البريد الإلكتروني بنجاح!' });
      setFormData({ recipient: '', subject: '', body: '' });
      fetchEmailLogs();
    } else {
      setMessage({ type: 'error', text: data.error || 'فشل إرسال البريد الإلكتروني' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="flex items-center text-indigo-600 hover:text-indigo-700 mb-2"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للوحة التحكم
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">إرسال رسائل Gmail</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">إرسال رسالة جديدة</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني للمستلم</label>
                <input
                  type="email"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الموضوع</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نص الرسالة</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={8}
                  required
                  disabled={sending}
                />
              </div>

              {message.text && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
                {sending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>ملاحظة:</strong> يجب تكوين إعدادات Gmail في ملف .env لإرسال الرسائل. راجع ملف .env.example
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">سجل الرسائل المرسلة</h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {emailLogs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا توجد رسائل مرسلة بعد</p>
              ) : (
                emailLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{log.subject}</p>
                        <p className="text-sm text-gray-600">إلى: {log.recipient}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {log.status === 'sent' ? 'تم الإرسال' : log.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(log.sent_at).toLocaleString('ar-EG')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
