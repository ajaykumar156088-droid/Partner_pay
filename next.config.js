/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Produce a standalone output which is convenient for Docker/Render deployments
  output: 'standalone',
  // Server Actions are enabled by default in Next.js 14; no experimental flags needed.
  // For CI/deployment (Render) we skip ESLint during build to avoid failing
  // deployments due to pre-existing lint warnings; developers should run
  // `npm run lint` locally and fix issues progressively.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable Next.js image optimization to avoid needing image optimization infrastructure
  // on non-Vercel hosts. If you deploy to Vercel and want the optimizer, set this to false.
  images: {
    remotePatterns: [],
    unoptimized: true,
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


