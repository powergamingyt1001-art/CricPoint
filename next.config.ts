import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'g.cricapi.com',
        pathname: '/iapi/**',
      },
      {
        protocol: 'https',
        hostname: 'h.cricapi.com',
        pathname: '/img/**',
      },
    ],
  },
};

export default nextConfig;
