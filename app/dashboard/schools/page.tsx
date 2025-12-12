'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface School {
  id: number;
  name: string;
  location: string;
  principal_name: string;
  phone: string;
  email: string;
  notes: string;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    principal_name: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const res = await fetch('/api/schools');
    const data = await res.json();
    setSchools(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/schools/${editingId}` : '/api/schools';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ name: '', location: '', principal_name: '', phone: '', email: '', notes: '' });
    setShowForm(false);
    setEditingId(null);
    fetchSchools();
  };

  const handleEdit = (school: School) => {
    setFormData({
      name: school.name,
      location: school.location,
      principal_name: school.principal_name,
      phone: school.phone,
      email: school.email,
      notes: school.notes,
    });
    setEditingId(school.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المدرسة؟')) {
      await fetch(`/api/schools/${id}`, { method: 'DELETE' });
      fetchSchools();
    }
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
            <h1 className="text-3xl font-bold text-gray-800">معلومات الابتدائيات</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: '', location: '', principal_name: '', phone: '', email: '', notes: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            إضافة مدرسة جديدة
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'تعديل المدرسة' : 'إضافة مدرسة جديدة'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم المدرسة</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الموقع</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">اسم المدير</label>
                <input
                  type="text"
                  value={formData.principal_name}
                  onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">ملاحظات</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="col-span-2 flex gap-2">
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">#</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">اسم المدرسة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الموقع</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">اسم المدير</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الهاتف</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schools.map((school, index) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium">{school.name}</td>
                  <td className="px-6 py-4 text-sm">{school.location}</td>
                  <td className="px-6 py-4 text-sm">{school.principal_name}</td>
                  <td className="px-6 py-4 text-sm">{school.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(school)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(school.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
