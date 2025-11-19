import Link from 'next/link';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

export const metadata = {
  title: 'Help Center - Partner Pay',
  description: 'Partner Pay Help Center and Support',
};

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Accounts are created by administrators only. If you need an account, please contact your administrator or reach out to help@partnerpay.com."
    },
    {
      question: "How do I check my balance?",
  answer: "Log in to your account and navigate to the Dashboard. Your current balance will be displayed prominently at the top of the page."
    },
    {
      question: "What are the withdrawal limits?",
  answer: "UPI withdrawals require a minimum balance of ₹2,500, while USDT withdrawals require a minimum of ₹500. There are no maximum limits for withdrawals."
    },
    {
      question: "How long do withdrawals take to process?",
  answer: "Withdrawal processing times vary. UPI transfers typically take 1-2 business days, while USDT transfers may take 2-5 business days. Contact support if your withdrawal is delayed."
    },
    {
      question: "Is my money safe?",
  answer: "Yes, we use industry-standard security measures including 256-bit SSL encryption, secure password hashing, and regular security audits to protect your funds and data."
    },
    {
      question: "What should I do if I forget my password?",
  answer: "Contact our support team at help@partnerpay.com with your registered email address, and we&apos;ll assist you with password reset."
    },
    {
      question: "Can I use the platform on mobile devices?",
  answer: "Yes, Partner Pay is fully responsive and works seamlessly on desktop, tablet, and mobile devices. Simply access the platform through your mobile browser."
    },
    {
      question: "How do I view my transaction history?",
  answer: "Navigate to your Dashboard and scroll down to the &apos;Transaction History&apos; section. All your transactions are listed with dates, amounts, and details."
    }
  ];

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
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Help Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find answers to common questions and get support
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg"
            >
              Contact Support
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}






