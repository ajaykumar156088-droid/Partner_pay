'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ScratchCard from '@/components/ScratchCard';

interface Voucher {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'scratched' | 'redeemed';
  scratchedAt?: string;
  redeemedAt?: string;
  createdAt: string;
  createdBy: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  balance: number;
}

export default function VouchersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState('');

  // Fetch user and vouchers once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUser();
    fetchVouchers();
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

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/user/vouchers');
      if (response.ok) {
        const data = await response.json();
        setVouchers(data.vouchers || []);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScratch = async (voucherId: string) => {
    if (processing) return;
    setProcessing(voucherId);

    try {
      const response = await fetch(`/api/user/vouchers/${voucherId}/scratch`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to scratch voucher');
        return;
      }

      const data = await response.json();

      // Update local state
      setVouchers(prev => prev.map(v =>
        v.id === voucherId
          ? { ...v, status: data.voucher.status, scratchedAt: data.voucher.scratchedAt }
          : v
      ));

      // Refresh user balance if redeemed
      if (data.voucher.status === 'redeemed') {
        fetchUser();
      }
    } catch (error) {
      console.error('Error scratching voucher:', error);
      alert('Failed to scratch voucher');
    } finally {
      setProcessing(null);
    }
  };

  const handleRedeem = async (voucherId: string) => {
    if (processing) return;
    setProcessing(voucherId);

    try {
      const response = await fetch(`/api/user/vouchers/${voucherId}/scratch`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to redeem voucher');
        setProcessing(null);
        return;
      }

      const data = await response.json();

      // Find the voucher to get the amount
      const voucher = vouchers.find(v => v.id === voucherId);
      const redeemedAmount = voucher?.amount || data.voucher.amount;

      // Update local state
      setVouchers(prev => prev.map(v =>
        v.id === voucherId
          ? { ...v, status: 'redeemed', redeemedAt: data.voucher.redeemedAt }
          : v
      ));

      // Immediately update user balance in state (optimistic update)
      if (user) {
        setUser({
          ...user,
          balance: (user.balance || 0) + redeemedAmount
        });
      }

      // Refresh user balance from server to ensure accuracy
      await fetchUser();

      alert(data.message || `Successfully redeemed ₹${redeemedAmount.toLocaleString('en-IN')}!`);
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      alert('Failed to redeem voucher');
      // Revert optimistic update on error
      fetchUser();
    } finally {
      setProcessing(null);
    }
  };

  const handleApplyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    setProcessing('code');

    try {
      const response = await fetch('/api/user/vouchers/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to apply code');
        return;
      }

      // If voucher returned and redeemed, update local state and user balance
      if (data.voucher) {
        // Add to vouchers list if newly assigned
        setVouchers(prev => {
          const exists = prev.find(v => v.id === data.voucher.id);
          if (exists) {
            return prev.map(v => v.id === data.voucher.id ? data.voucher : v);
          }
          return [data.voucher, ...prev];
        });

        if (data.voucher.status === 'redeemed') {
          // optimistic balance update
          fetchUser();
          alert(data.message || `Successfully redeemed ₹${data.voucher.amount.toLocaleString('en-IN')}!`);
        } else {
          alert(data.message || 'Code applied. Scratch/Redeem as needed.');
        }
      }
    } catch (error) {
      console.error('Error applying code:', error);
      alert('Failed to apply code');
    } finally {
      setProcessing(null);
      setCodeInput('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const pendingVouchers = vouchers.filter(v => v.status === 'pending');
  const scratchedVouchers = vouchers.filter(v => v.status === 'scratched');
  const redeemedVouchers = vouchers.filter(v => v.status === 'redeemed');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar userEmail={user?.email} showLogout={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton href="/dashboard" label="Back to Dashboard" />
        </div>
        <div className="mb-6">
          <form onSubmit={handleApplyCode} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={!!processing}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg disabled:opacity-50"
            >
              Apply
            </button>
          </form>
        </div>
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Scratch Vouchers
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Scratch your vouchers to reveal rewards and redeem them instantly
              </p>
            </div>
            {user && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
                <h2 className="text-xs sm:text-sm font-medium text-blue-100 mb-1">
                  Current Balance
                </h2>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹{user.balance?.toLocaleString('en-IN') || '0.00'}
                </p>
              </div>
            )}
          </div>
        </div>

        {vouchers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No Vouchers Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You don&apos;t have any vouchers at the moment. Check back later!
            </p>
          </div>
        ) : (
          <>
            {/* Pending Vouchers */}
            {pendingVouchers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Pending ({pendingVouchers.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingVouchers.map((voucher) => (
                    <ScratchCard
                      key={voucher.id}
                      amount={voucher.amount}
                      reason={voucher.reason}
                      voucherId={voucher.id}
                      status={voucher.status}
                      onScratch={() => handleScratch(voucher.id)}
                      onRedeem={() => handleRedeem(voucher.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Scratched Vouchers */}
            {scratchedVouchers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Ready to Redeem ({scratchedVouchers.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scratchedVouchers.map((voucher) => (
                    <ScratchCard
                      key={voucher.id}
                      amount={voucher.amount}
                      reason={voucher.reason}
                      voucherId={voucher.id}
                      status={voucher.status}
                      onScratch={() => handleScratch(voucher.id)}
                      onRedeem={() => handleRedeem(voucher.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Redeemed Vouchers */}
            {redeemedVouchers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Redeemed ({redeemedVouchers.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {redeemedVouchers.map((voucher) => (
                    <ScratchCard
                      key={voucher.id}
                      amount={voucher.amount}
                      reason={voucher.reason}
                      voucherId={voucher.id}
                      status={voucher.status}
                      onScratch={() => { }}
                      onRedeem={() => { }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

