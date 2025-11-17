'use client';

import { useRouter } from 'next/navigation';
import Logo from './Logo';

interface NavbarProps {
  userEmail?: string;
  showLogout?: boolean;
  adminNav?: boolean;
}

export default function Navbar({ userEmail, showLogout = true, adminNav = false }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <div className="flex items-center space-x-1 sm:space-x-3 lg:space-x-6">
            <Logo showText={true} size="md" className="text-base sm:text-lg" />
            {adminNav && (
              <div className="hidden sm:flex items-center space-x-1">
                <a
                  href="/admin/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
                <a
                  href="/admin/users"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 relative group"
                >
                  Users
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
                <a
                  href="/admin/vouchers"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 relative group"
                >
                  Vouchers
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
                <a
                  href="/admin/transactions"
                  className="hidden lg:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 relative group"
                >
                  Transactions
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
                <a
                  href="/admin/authentications"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 relative group"
                >
                  Auth Approvals
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
                <a
                  href="/admin/settings"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 relative group"
                >
                  Settings
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </a>
              </div>
            )}
            {!adminNav && userEmail && (
              <a
                href="/vouchers"
                className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 relative group"
              >
                Vouchers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </a>
            )}
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {userEmail && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium truncate max-w-[120px] sm:max-w-none">
                  {userEmail}
                </span>
              </div>
            )}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
