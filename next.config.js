/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    APIURL: 'https://prowlarr.at7.in',
    APIKEY: process.env.APIKEY,
  },
}

module.exports = nextConfig
