'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Plus, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Report {
  id: number;
  title: string;
  content: string;
  inspector_name: string;
  report_date: string;
  report_type: string;
  created_at: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    inspector_name: '',
    report_date: '',
    report_type: '',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await fetch('/api/reports');
    const data = await res.json();
    setReports(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ title: '', content: '', inspector_name: '', report_date: '', report_type: '' });
    setShowForm(false);
    fetchReports();
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
      await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      fetchReports();
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
            <h1 className="text-3xl font-bold text-gray-800">تقارير المفتشية</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            إضافة تقرير جديد
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">إضافة تقرير جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان التقرير</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المفتش</label>
                  <input
                    type="text"
                    value={formData.inspector_name}
                    onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">تاريخ التقرير</label>
                  <input
                    type="date"
                    value={formData.report_date}
                    onChange={(e) => setFormData({ ...formData, report_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع التقرير</label>
                  <select
                    value={formData.report_type}
                    onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">اختر نوع التقرير</option>
                    <option value="زيارة ميدانية">زيارة ميدانية</option>
                    <option value="تقييم أداء">تقييم أداء</option>
                    <option value="متابعة">متابعة</option>
                    <option value="تقرير شهري">تقرير شهري</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">محتوى التقرير</label>
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
                  حفظ التقرير
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

        {viewReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">{viewReport.title}</h2>
              <div className="space-y-3 mb-4">
                <p><strong>المفتش:</strong> {viewReport.inspector_name}</p>
                <p><strong>التاريخ:</strong> {viewReport.report_date}</p>
                <p><strong>النوع:</strong> {viewReport.report_type}</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">محتوى التقرير:</h3>
                <p className="whitespace-pre-wrap">{viewReport.content}</p>
              </div>
              <button
                onClick={() => setViewReport(null)}
                className="mt-6 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">#</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">العنوان</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المفتش</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">النوع</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report, index) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium">{report.title}</td>
                  <td className="px-6 py-4 text-sm">{report.inspector_name}</td>
                  <td className="px-6 py-4 text-sm">{report.report_date}</td>
                  <td className="px-6 py-4 text-sm">{report.report_type}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewReport(report)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
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
