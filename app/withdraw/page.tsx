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
  authenticationStatus?: 'pending' | 'authenticated';
  authenticatedAt?: string;
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
  const [authLink, setAuthLink] = useState('');
  const [authenticating, setAuthenticating] = useState(false);

  // fetchUser and fetchAuthLink run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUser();
    fetchAuthLink();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          router.push('/login');
        }
        return;
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchAuthLink = async () => {
    try {
      const response = await fetch('/api/user/authenticate');
      if (response.ok) {
        const data = await response.json();
        setAuthLink(data.authenticationLink);
      }
    } catch (error) {
      console.error('Error fetching auth link:', error);
    }
  };

  const handleAuthenticate = async () => {
    if (authenticating) return;
    setAuthenticating(true);
    // Use client-side navigation for immediate response
    try {
      router.push('/special-auth');
    } catch (err) {
      // Fallback to full redirect if router fails
      window.location.href = '/special-auth';
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

  const balance = user?.balance || 0;
  const hasMinimumBalanceForAuth = balance >= 1000; // Authentication available at ₹1,000
  const hasMinimumBalanceForUPI = balance >= 2500; // UPI withdrawal requires ₹2,500
  const isAuthenticated = user?.authenticationStatus === 'authenticated';
  const isPending = user?.authenticationStatus === 'pending';
  const canWithdrawUPI = hasMinimumBalanceForUPI && isAuthenticated;
  const canWithdrawUSDT = balance >= 500; // No authentication required for USDT

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar showLogout={true} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-fade-in">
        <div className="mb-6">
          <BackButton href="/dashboard" label="Back to Dashboard" />
        </div>

        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Withdraw Funds
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Securely withdraw your balance to your preferred payment method
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white overflow-hidden animate-slide-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-blue-100 uppercase tracking-wider mb-3">
                  Available Balance
                </h2>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                  ₹{user?.balance?.toLocaleString('en-IN') || '0.00'}
                </p>
                <p className="text-sm text-blue-100/80">Ready for withdrawal</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/20 rounded-2xl backdrop-blur-sm hidden sm:block border border-white/30">
                <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        {hasMinimumBalanceForAuth && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 mb-6 sm:mb-8 animate-slide-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Account Authentication
                </h3>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                    <span className="text-base text-green-600 dark:text-green-400 font-semibold">
                      Account Authenticated
                    </span>
                    {user?.authenticatedAt && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({new Date(user.authenticatedAt).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                ) : isPending ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-sm shadow-yellow-500/50"></div>
                    <span className="text-base text-yellow-600 dark:text-yellow-400 font-semibold">
                      Account Authentication Pending
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Authenticate your account to enable UPI withdrawals
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!isAuthenticated && (
                  <button
                    onClick={handleAuthenticate}
                    disabled={authenticating}
                    className="btn-primary whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {authenticating ? 'Redirecting…' : (isPending ? 'Reauthenticate' : 'Authenticate Account')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{success}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          {/* UPI Withdrawal */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 card-hover">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15l1-1m-1-1l-1 1m8-4l1-1m-1-1l-1 1m-8 0V8a2 2 0 012-2h4a2 2 0 012 2v2M7 15h10" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  UPI Transfer
                </h3>
              </div>
            </div>


            {!canWithdrawUPI && (
              <div className="mb-5 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border-l-4 border-yellow-500">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  {!hasMinimumBalanceForUPI
                    ? 'Minimum UPI withdrawal limit is ₹2,500.'
                    : !isAuthenticated
                      ? 'Minimum UPI withdrawal limit is ₹2,500. Please authenticate your account first.'
                      : 'Minimum UPI withdrawal limit is ₹2,500.'}
                </p>
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-5">
              <div>
                <label htmlFor="upiId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                  UPI ID
                </label>
                <input
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  disabled={!canWithdrawUPI}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="yourname@upi"
                />
              </div>
              <button
                type="submit"
                onClick={() => setMethod('upi')}
                disabled={!canWithdrawUPI || loading}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${hasMinimumBalanceForUPI && !isAuthenticated
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                  : canWithdrawUPI
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : hasMinimumBalanceForUPI && !isAuthenticated ? 'Authenticate to Withdraw' : 'Withdraw to UPI'}
              </button>
            </form>
          </div>

          {/* USDT Withdrawal */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 card-hover">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                  <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  USDT Transfer
                </h3>
              </div>
            </div>


            {!canWithdrawUSDT && (
              <div className="mb-5 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border-l-4 border-yellow-500">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Minimum USDT withdrawal limit is ₹500.
                </p>
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-5">
              <div>
                <label htmlFor="usdtAddress" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                  USDT Wallet Address
                </label>
                <input
                  id="usdtAddress"
                  type="text"
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  disabled={!canWithdrawUSDT}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0x..."
                />
              </div>
              <button
                type="submit"
                onClick={() => setMethod('usdt')}
                disabled={!canWithdrawUSDT || loading}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${canWithdrawUSDT
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Withdraw to USDT'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


