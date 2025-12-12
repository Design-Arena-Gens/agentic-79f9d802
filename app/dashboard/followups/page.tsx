'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Manager {
  id: number;
  name: string;
}

interface Followup {
  id: number;
  manager_id: number;
  manager_name: string;
  followup_date: string;
  status: string;
  notes: string;
}

export default function FollowupsPage() {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    manager_id: '',
    followup_date: '',
    status: '',
    notes: '',
  });

  useEffect(() => {
    fetchFollowups();
    fetchManagers();
  }, []);

  const fetchFollowups = async () => {
    const res = await fetch('/api/followups');
    const data = await res.json();
    setFollowups(data);
  };

  const fetchManagers = async () => {
    const res = await fetch('/api/managers');
    const data = await res.json();
    setManagers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/followups/${editingId}` : '/api/followups';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ manager_id: '', followup_date: '', status: '', notes: '' });
    setShowForm(false);
    setEditingId(null);
    fetchFollowups();
  };

  const handleEdit = (followup: Followup) => {
    setFormData({
      manager_id: followup.manager_id.toString(),
      followup_date: followup.followup_date,
      status: followup.status,
      notes: followup.notes,
    });
    setEditingId(followup.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المتابعة؟')) {
      await fetch(`/api/followups/${id}`, { method: 'DELETE' });
      fetchFollowups();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'قيد التنفيذ': return 'bg-yellow-100 text-yellow-800';
      case 'متأخر': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-800">متابعة المدراء</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ manager_id: '', followup_date: '', status: '', notes: '' });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            إضافة متابعة جديدة
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'تعديل المتابعة' : 'إضافة متابعة جديدة'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">المدير</label>
                <select
                  value={formData.manager_id}
                  onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">اختر المدير</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ المتابعة</label>
                <input
                  type="date"
                  value={formData.followup_date}
                  onChange={(e) => setFormData({ ...formData, followup_date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الحالة</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">اختر الحالة</option>
                  <option value="مكتمل">مكتمل</option>
                  <option value="قيد التنفيذ">قيد التنفيذ</option>
                  <option value="متأخر">متأخر</option>
                  <option value="ملغي">ملغي</option>
                </select>
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
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المدير</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">تاريخ المتابعة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الحالة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الملاحظات</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {followups.map((followup, index) => (
                <tr key={followup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium">{followup.manager_name}</td>
                  <td className="px-6 py-4 text-sm">{followup.followup_date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(followup.status)}`}>
                      {followup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{followup.notes}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(followup)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(followup.id)}
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
