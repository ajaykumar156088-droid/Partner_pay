export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Partner Pay</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Your trusted partner for seamless payment management.
              Secure, reliable, and efficient financial transactions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/withdraw" className="hover:text-white transition">
                  Withdraw Funds
                </a>
              </li>
              <li>
                <a href="/admin/dashboard" className="hover:text-white transition">
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/help" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © {currentYear} Partner Pay Platform. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="/privacy" className="text-gray-400 hover:text-white transition text-xs sm:text-sm">
                Privacy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition text-xs sm:text-sm">
                Terms
              </a>
              <a href="/contact" className="text-gray-400 hover:text-white transition text-xs sm:text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

