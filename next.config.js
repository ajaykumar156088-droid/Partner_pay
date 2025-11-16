/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
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


