'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

interface User {
  id: string;
  email: string;
  balance: number;
  authenticationStatus?: 'pending' | 'authenticated';
  authenticatedAt?: string;
}

export default function AdminAuthenticationsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  // fetchPendingAuthentications runs once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPendingAuthentications();
  }, []);

  const fetchPendingAuthentications = async () => {
    try {
      const response = await fetch('/api/admin/authentications');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching pending authentications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action === 'approve' ? 'approve' : 'reject'} this authentication request?`)) {
      return;
    }

    setProcessing(userId);
    try {
      const response = await fetch('/api/admin/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || `Failed to ${action} authentication`);
        return;
      }

      // Remove user from list after approval/rejection
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error(`Error ${action}ing authentication:`, error);
      alert(`Failed to ${action} authentication`);
    } finally {
      setProcessing(null);
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
          <BackButton href="/admin/dashboard" label="Back to Dashboard" />
        </div>
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Authentication Approvals
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Review and approve authentication requests from users with balance ≥ ₹2,500
              </p>
            </div>
            <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                {users.length} Pending Request{users.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {users.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No Pending Requests
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                All authentication requests have been processed.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          User Email
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white">
                            {user.email}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                            ₹{user.balance.toLocaleString('en-IN')}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm hidden sm:table-cell">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Pending
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleAction(user.id, 'approve')}
                                disabled={processing === user.id}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {processing === user.id ? 'Processing...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleAction(user.id, 'reject')}
                                disabled={processing === user.id}
                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Reject
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}



