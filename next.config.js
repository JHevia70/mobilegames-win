/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove removeConsole to see all logs in production
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

module.exports = nextConfig;