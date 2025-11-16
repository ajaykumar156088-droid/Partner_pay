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
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b-2 border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
            <Logo showText={true} size="md" className="text-base sm:text-lg" />
            {adminNav && (
              <>
                <a
                  href="/admin/dashboard"
                  className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Dashboard
                </a>
                <a
                  href="/admin/users"
                  className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Users
                </a>
                <a
                  href="/admin/transactions"
                  className="hidden lg:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Transactions
                </a>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userEmail && (
              <div className="hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium truncate max-w-[100px] sm:max-w-none">
                  {userEmail}
                </span>
              </div>
            )}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-xs sm:text-sm font-medium shadow-md hover:shadow-lg"
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

