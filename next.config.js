/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14; no experimental flags needed.
  // Keep ESLint checks enabled during build to surface issues early.
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Allow serving static files from data folder
  async rewrites() {
    return [
      {
        source: '/data/:path*',
        destination: '/data/:path*',
      },
    ];
  },
}

module.exports = nextConfig


