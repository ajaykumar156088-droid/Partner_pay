'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

interface User {
  id: string;
  email: string;
  balance: number;
}

export default function WithdrawPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [method, setMethod] = useState<'upi' | 'usdt' | null>(null);
  const [upiId, setUpiId] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          upiId: method === 'upi' ? upiId : undefined,
          usdtAddress: method === 'usdt' ? usdtAddress : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Withdrawal failed');
      } else {
        setSuccess('Withdrawal successful');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canWithdrawUPI = (user?.balance || 0) >= 2500;
  const canWithdrawUSDT = (user?.balance || 0) >= 500;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar showLogout={true} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <BackButton href="/dashboard" label="Back to Dashboard" />
        </div>
        
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Withdraw Funds
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Securely withdraw your balance to your preferred payment method
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-blue-100 mb-2">
                Available Balance
              </h2>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                ₹{user?.balance.toLocaleString('en-IN') || '0.00'}
              </p>
            </div>
            <div className="p-3 sm:p-4 bg-white/20 rounded-lg backdrop-blur-sm hidden sm:block">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* UPI Withdrawal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15l1-1m-1-1l-1 1m8-4l1-1m-1-1l-1 1m-8 0V8a2 2 0 012-2h4a2 2 0 012 2v2M7 15h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  UPI Transfer
                </h3>
              </div>
            </div>
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                ⚠️ Minimum withdrawal limit: ₹2,500
              </p>
            </div>
            
            {!canWithdrawUPI && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-300 rounded">
                Minimum UPI withdrawal limit is ₹2,500.
              </div>
            )}

            <form onSubmit={handleWithdraw}>
              <div className="mb-4">
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  UPI ID
                </label>
                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  disabled={!canWithdrawUPI}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="yourname@upi"
                />
              </div>
              <button
                type="submit"
                onClick={() => setMethod('upi')}
                disabled={!canWithdrawUPI || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Withdraw to UPI'}
              </button>
            </form>
          </div>

          {/* USDT Withdrawal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  USDT Transfer
                </h3>
              </div>
            </div>
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                ⚠️ Minimum withdrawal limit: ₹500
              </p>
            </div>
            
            {!canWithdrawUSDT && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-300 rounded">
                Minimum USDT withdrawal limit is ₹500.
              </div>
            )}

            <form onSubmit={handleWithdraw}>
              <div className="mb-4">
                <label htmlFor="usdtAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  USDT Wallet Address
                </label>
                <input
                  id="usdtAddress"
                  type="text"
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  disabled={!canWithdrawUSDT}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0x..."
                />
              </div>
              <button
                type="submit"
                onClick={() => setMethod('usdt')}
                disabled={!canWithdrawUSDT || loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Withdraw to USDT'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


