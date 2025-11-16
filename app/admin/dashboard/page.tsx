'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

interface Stats {
  totalBalance: number;
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar showLogout={true} adminNav={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton href="/login" label="Back to Login" />
        </div>
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                System overview and management
              </p>
            </div>
            <div className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">Admin Mode</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition duration-200">
            <h2 className="text-xs sm:text-sm font-medium text-indigo-100 mb-2">
              Total System Balance
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              ₹{stats?.totalBalance.toLocaleString('en-IN') || '0.00'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition duration-200">
            <h2 className="text-xs sm:text-sm font-medium text-blue-100 mb-2">
              Total Users
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {stats?.totalUsers || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition duration-200">
            <h2 className="text-xs sm:text-sm font-medium text-purple-100 mb-2">
              Admins
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {stats?.totalAdmins || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white transform hover:scale-105 transition duration-200">
            <h2 className="text-xs sm:text-sm font-medium text-green-100 mb-2">
              Regular Users
            </h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              {stats?.totalRegularUsers || 0}
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Link
            href="/admin/users"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border border-gray-200 dark:border-gray-700 transform hover:scale-105"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Manage Users
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Create, edit, and delete users
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/transactions"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition border border-gray-200 dark:border-gray-700 transform hover:scale-105"
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  View Transactions
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  View all system transactions
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}


