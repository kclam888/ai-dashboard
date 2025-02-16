/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['kenneth12.netlify.app'],
    },
  },
}

module.exports = nextConfig