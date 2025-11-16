import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Terms of Service - Partner Pay',
  description: 'Partner Pay Terms of Service and User Agreement',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo showText={true} size="md" />
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <BackButton href="/" label="Back to Home" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                By accessing and using Partner Pay Platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Account Registration and Security
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Payment Services
              </h2>
              <div className="space-y-3 text-gray-600 dark:text-gray-400">
                <p><strong className="text-gray-900 dark:text-white">Balance Management:</strong> Your account balance is managed securely and can be viewed in your dashboard.</p>
                <p><strong className="text-gray-900 dark:text-white">Withdrawals:</strong> Withdrawal requests are subject to minimum limits and processing times. UPI withdrawals require a minimum of ₹2,500, and USDT withdrawals require a minimum of ₹500.</p>
                <p><strong className="text-gray-900 dark:text-white">Transaction Fees:</strong> All applicable fees will be clearly disclosed before completing any transaction.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Prohibited Activities
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to any part of the platform</li>
                <li>Interfere with or disrupt the platform's security or functionality</li>
                <li>Use automated systems to access the platform without permission</li>
                <li>Share your account credentials with others</li>
                <li>Engage in any fraudulent or deceptive practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                All content, features, and functionality of the Partner Pay Platform, including but not limited to text, graphics, logos, and software, are the exclusive property of Partner Pay and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Partner Pay shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Service Availability
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We strive to maintain platform availability but do not guarantee uninterrupted access. The platform may be temporarily unavailable due to maintenance, updates, or unforeseen circumstances. We are not liable for any losses resulting from service interruptions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Modifications to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notifications. Continued use of the platform after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Termination
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Email:</strong> <a href="mailto:help@partnerpay.com" className="text-blue-600 dark:text-blue-400 hover:underline">help@partnerpay.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



