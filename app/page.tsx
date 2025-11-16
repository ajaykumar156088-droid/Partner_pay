import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default async function HomePage() {
  const session = await getSession();
  
  if (session) {
    if (session.role === 'admin') {
      redirect('/admin/dashboard');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Partner Pay
            </h1>
            <Link
              href="/login"
              className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Partner Pay Platform
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
              Secure, reliable, and efficient payment management for your business. 
              Manage transactions, balances, and withdrawals with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-105 text-base sm:text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition hover:bg-gray-50 dark:hover:bg-gray-700 text-base sm:text-lg"
              >
                Contact Us
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Secure & Encrypted
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  256-bit SSL encryption ensures all your transactions and data are completely secure.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg w-fit mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Reliable Platform
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Built with modern technology for 99.9% uptime and seamless user experience.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Easy Management
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Intuitive dashboard for managing balances, transactions, and withdrawals effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
