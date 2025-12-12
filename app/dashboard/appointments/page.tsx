'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Edit, Trash2, Bell, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: number;
  title: string;
  description: string;
  appointment_date: string;
  location: string;
  attendees: string;
  status: string;
  notified: number;
  created_at: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    appointment_date: '',
    location: '',
    attendees: '',
    status: 'scheduled',
  });

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(checkUpcomingAppointments, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  const checkUpcomingAppointments = () => {
    const now = new Date();
    appointments.forEach((apt) => {
      const aptDate = new Date(apt.appointment_date);
      const diffMinutes = (aptDate.getTime() - now.getTime()) / (1000 * 60);

      if (diffMinutes > 0 && diffMinutes <= 30 && !apt.notified) {
        showNotification(apt);
      }
    });
  };

  const showNotification = (apt: Appointment) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('تذكير بموعد قريب', {
        body: `${apt.title} في ${apt.location}`,
        icon: '/icon.png',
      });
    }
    alert(`تذكير: لديك موعد "${apt.title}" في ${apt.location} خلال 30 دقيقة`);
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/appointments/${editingId}` : '/api/appointments';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({
      title: '',
      description: '',
      appointment_date: '',
      location: '',
      attendees: '',
      status: 'scheduled',
    });
    setShowForm(false);
    setEditingId(null);
    fetchAppointments();
  };

  const handleEdit = (apt: Appointment) => {
    setFormData({
      title: apt.title,
      description: apt.description,
      appointment_date: apt.appointment_date,
      location: apt.location,
      attendees: apt.attendees,
      status: apt.status,
    });
    setEditingId(apt.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      fetchAppointments();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'مجدول';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const isUpcoming = (date: string) => {
    const aptDate = new Date(date);
    const now = new Date();
    const diffMinutes = (aptDate.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes > 0 && diffMinutes <= 60;
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
            <h1 className="text-3xl font-bold text-gray-800">المواعيد والاجتماعات</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                title: '',
                description: '',
                appointment_date: '',
                location: '',
                attendees: '',
                status: 'scheduled',
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            إضافة موعد جديد
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'تعديل الموعد' : 'إضافة موعد جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان الموعد</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">تاريخ ووقت الموعد</label>
                  <input
                    type="datetime-local"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المكان</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">الحضور</label>
                  <input
                    type="text"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="أسماء الحضور مفصولة بفاصلة"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الحالة</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="scheduled">مجدول</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingId ? 'تحديث' : 'إضافة'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                isUpcoming(apt.appointment_date) ? 'border-2 border-orange-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <CalendarIcon className="w-6 h-6 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{apt.title}</h3>
                      {apt.description && (
                        <p className="text-gray-600 mt-1">{apt.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="mr-9 space-y-1">
                    <p className="text-sm text-gray-700">
                      <strong>التاريخ:</strong> {new Date(apt.appointment_date).toLocaleString('ar-EG')}
                    </p>
                    {apt.location && (
                      <p className="text-sm text-gray-700">
                        <strong>المكان:</strong> {apt.location}
                      </p>
                    )}
                    {apt.attendees && (
                      <p className="text-sm text-gray-700">
                        <strong>الحضور:</strong> {apt.attendees}
                      </p>
                    )}
                    <div className="mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {getStatusText(apt.status)}
                      </span>
                      {isUpcoming(apt.appointment_date) && (
                        <span className="mr-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium inline-flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          موعد قريب
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(apt)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد مواعيد مجدولة</p>
          </div>
        )}
      </div>
    </div>
  );
}
