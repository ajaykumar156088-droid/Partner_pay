'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export default function CreateVoucherPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    reason: '',
    code: '',
    // whether to create a coupon code (true) or assign to a specific user (false)
    isCoupon: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Read query param to pre-select coupon mode when opening from admin list
  const searchParams = useSearchParams();
  useEffect(() => {
    const val = searchParams?.get('coupon');
    if (val === 'true') {
      setFormData(prev => ({ ...prev, isCoupon: true, userId: '' }));
    }
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      // Filter out admin users, only show regular users
      const regularUsers = (data.users || []).filter((u: User) => u.role === 'user');
      setUsers(regularUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      // If creating a coupon and no code provided, generate one
      let codeToSend = undefined;
      if (formData.isCoupon) {
        codeToSend = formData.code && formData.code.trim() ? formData.code.trim() : undefined;
        if (!codeToSend) {
          // generate a simple random 10-char alphanumeric code
          codeToSend = Array.from({ length: 10 }, () => Math.random().toString(36).charAt(2)).join('').toUpperCase();
        }
      }

      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // only include userId when assigning to a specific user
          userId: formData.isCoupon ? undefined : formData.userId,
          amount: parseFloat(formData.amount),
          reason: formData.reason || 'Voucher from admin',
          code: codeToSend,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create voucher');
      }

  setSuccess(true);
  setFormData({ userId: '', amount: '', reason: '', code: '', isCoupon: false });
      
      setTimeout(() => {
        router.push('/admin/vouchers');
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Failed to create voucher');
    } finally {
      setSubmitting(false);
    }
  };

  // helper to generate a code into form
  const generateCode = () => {
    const generated = Array.from({ length: 10 }, () => Math.random().toString(36).charAt(2)).join('').toUpperCase();
    setFormData(prev => ({ ...prev, code: generated }));
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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton href="/admin/vouchers" label="Back to Vouchers" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Scratch Voucher
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
            Add a new scratch voucher to a user's account
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 rounded">
              Voucher created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voucher Type
              </label>
              <div className="flex items-center gap-4 mb-3">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="voucherType"
                    checked={!formData.isCoupon}
                    onChange={() => setFormData({ ...formData, isCoupon: false })}
                    className="form-radio"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Assign to user</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="voucherType"
                    checked={formData.isCoupon}
                    onChange={() => setFormData({ ...formData, isCoupon: true, userId: '' })}
                    className="form-radio"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Create coupon code</span>
                </label>
              </div>

              {!formData.isCoupon ? (
                <select
                  id="userId"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Choose a user...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Enter or generate a code"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                  >
                    Generate
                  </button>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voucher Amount (₹) *
              </label>
              <input
                type="number"
                id="amount"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason (Visible to User)
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g., Bonus reward, Referral bonus, etc."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create Voucher'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/vouchers')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

