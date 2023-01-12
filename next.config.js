/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    APIURL: process.env.APIURL || 'https://prowlarr.at7.in',
    APIKEY: process.env.APIKEY || '3fbb3827a1c34737bf268287c4c93986',
  },
}

module.exports = nextConfig
