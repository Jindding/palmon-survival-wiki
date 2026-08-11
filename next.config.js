/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "nng-phinf.pstatic.net" },
    ],
  },
};

module.exports = nextConfig;
