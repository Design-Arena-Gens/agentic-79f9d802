'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Trash2, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Schedule {
  id: number;
  recipient: string;
  subject: string;
  content: string;
  scheduled_date: string;
  status: string;
  created_at: string;
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    content: '',
    scheduled_date: '',
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const res = await fetch('/api/schedules');
    const data = await res.json();
    setSchedules(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ recipient: '', subject: '', content: '', scheduled_date: '' });
    setShowForm(false);
    fetchSchedules();
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الجدول؟')) {
      await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      fetchSchedules();
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'sent') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    return <Clock className="w-5 h-5 text-orange-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link
              href="/dashboard"
              className="flex items-center text-indigo-600 hover:text-indigo-700 mb-2"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للوحة التحكم
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">جداول الإرسال</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            جدولة إرسال جديد
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">جدولة إرسال جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني للمستلم</label>
                  <input
                    type="email"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">تاريخ ووقت الإرسال</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الموضوع</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">محتوى الرسالة</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={6}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  جدولة الإرسال
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">#</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المستلم</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الموضوع</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">تاريخ الإرسال</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedules.map((schedule, index) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{schedule.recipient}</td>
                  <td className="px-6 py-4 text-sm font-medium">{schedule.subject}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(schedule.scheduled_date).toLocaleString('ar-EG')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(schedule.status)}
                      <span>{schedule.status === 'sent' ? 'تم الإرسال' : 'قيد الانتظار'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      disabled={schedule.status === 'sent'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
