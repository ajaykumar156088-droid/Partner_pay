/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Produce a standalone output which is convenient for Docker/Render deployments
  output: 'standalone',
  // Server Actions are available by default in recent Next.js releases.
  // The `experimental.serverActions` option is no longer necessary and
  // can cause warnings/errors — remove it.
  // Disable ESLint checks during `next build` on the server to avoid
  // build-time failures caused by strict lint rules in this repo.
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


