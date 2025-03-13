/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['scontent-ord5-2.xx.fbcdn.net', '7x0zshh65t.ufs.sh'],
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

export default nextConfig;
