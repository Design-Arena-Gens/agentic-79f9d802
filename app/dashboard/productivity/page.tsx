'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface Productivity {
  id: number;
  entity_name: string;
  entity_type: string;
  visits: number;
  reports_submitted: number;
  score: number;
  period: string;
  created_at: string;
}

export default function ProductivityPage() {
  const [productivity, setProductivity] = useState<Productivity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    entity_name: '',
    entity_type: '',
    visits: '',
    reports_submitted: '',
    period: '',
  });

  useEffect(() => {
    fetchProductivity();
  }, []);

  const fetchProductivity = async () => {
    const res = await fetch('/api/productivity');
    const data = await res.json();
    setProductivity(data);
  };

  const calculateScore = (visits: number, reports: number) => {
    return ((visits * 0.4 + reports * 0.6) / 10) * 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateScore(
      parseInt(formData.visits),
      parseInt(formData.reports_submitted)
    );

    await fetch('/api/productivity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, score }),
    });

    setFormData({ entity_name: '', entity_type: '', visits: '', reports_submitted: '', period: '' });
    setShowForm(false);
    fetchProductivity();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="w-5 h-5 text-green-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
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
            <h1 className="text-3xl font-bold text-gray-800">حساب المردودية</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            إضافة سجل مردودية
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">معدل الزيارات</h3>
            <p className="text-3xl font-bold">
              {(productivity.reduce((sum, p) => sum + p.visits, 0) / (productivity.length || 1)).toFixed(1)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">معدل التقارير</h3>
            <p className="text-3xl font-bold">
              {(productivity.reduce((sum, p) => sum + p.reports_submitted, 0) / (productivity.length || 1)).toFixed(1)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">متوسط المردودية</h3>
            <p className="text-3xl font-bold">
              {(productivity.reduce((sum, p) => sum + p.score, 0) / (productivity.length || 1)).toFixed(1)}%
            </p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">إضافة سجل مردودية جديد</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم الجهة</label>
                <input
                  type="text"
                  value={formData.entity_name}
                  onChange={(e) => setFormData({ ...formData, entity_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">نوع الجهة</label>
                <select
                  value={formData.entity_type}
                  onChange={(e) => setFormData({ ...formData, entity_type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">اختر النوع</option>
                  <option value="مدير">مدير</option>
                  <option value="مدرسة">مدرسة</option>
                  <option value="مفتش">مفتش</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">عدد الزيارات</label>
                <input
                  type="number"
                  value={formData.visits}
                  onChange={(e) => setFormData({ ...formData, visits: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">عدد التقارير المقدمة</label>
                <input
                  type="number"
                  value={formData.reports_submitted}
                  onChange={(e) => setFormData({ ...formData, reports_submitted: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الفترة</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="مثال: يناير 2025"
                  required
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  حساب وحفظ
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
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">اسم الجهة</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">النوع</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الزيارات</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">التقارير</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المردودية</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الفترة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productivity.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium">{item.entity_name}</td>
                  <td className="px-6 py-4 text-sm">{item.entity_type}</td>
                  <td className="px-6 py-4 text-sm">{item.visits}</td>
                  <td className="px-6 py-4 text-sm">{item.reports_submitted}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getScoreIcon(item.score)}
                      <span className={`font-bold ${getScoreColor(item.score)}`}>
                        {item.score.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
