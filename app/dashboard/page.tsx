'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  School,
  FileText,
  Eye,
  Send,
  TrendingUp,
  Calendar,
  LogOut,
  Mail,
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  const menuItems = [
    {
      title: 'معلومات المديرين',
      icon: Users,
      href: '/dashboard/managers',
      color: 'bg-blue-500',
    },
    {
      title: 'معلومات الابتدائيات',
      icon: School,
      href: '/dashboard/schools',
      color: 'bg-green-500',
    },
    {
      title: 'تقارير المفتشية',
      icon: FileText,
      href: '/dashboard/reports',
      color: 'bg-purple-500',
    },
    {
      title: 'متابعة المدراء',
      icon: Eye,
      href: '/dashboard/followups',
      color: 'bg-orange-500',
    },
    {
      title: 'جداول الإرسال',
      icon: Send,
      href: '/dashboard/schedules',
      color: 'bg-pink-500',
    },
    {
      title: 'حساب المردودية',
      icon: TrendingUp,
      href: '/dashboard/productivity',
      color: 'bg-indigo-500',
    },
    {
      title: 'إرسال رسائل Gmail',
      icon: Mail,
      href: '/dashboard/email',
      color: 'bg-red-500',
    },
    {
      title: 'المواعيد والاجتماعات',
      icon: Calendar,
      href: '/dashboard/appointments',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">نظام المفتش</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">مرحباً، {user.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">لوحة التحكم</h2>
          <p className="text-gray-600">اختر القسم الذي تريد الوصول إليه</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 group"
              >
                <div
                  className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
