/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GITHUB_API_URL: process.env.GITHUB_API_URL || 'https://api.github.com',
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig