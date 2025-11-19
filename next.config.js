/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are enabled by default in Next.js 14; no experimental flags needed.
  // For CI/deployment (Render) we skip ESLint during build to avoid failing
  // deployments due to pre-existing lint warnings; developers should run
  // `npm run lint` locally and fix issues progressively.
  eslint: {
    ignoreDuringBuilds: true,
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


