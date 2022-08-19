/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    APIURL: process.env.APIURL,
    APIKEY: process.env.APIKEY,
  },
}

module.exports = nextConfig
