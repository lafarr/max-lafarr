import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '7x0zshh65t.ufs.sh',
			},
		],
	},
	async rewrites() {
		return await Promise.resolve([
			{
				source: '/api/proxy/:path*',
				destination: 'https://maxlafarr.com/api/:path*',
			},
		]);
	},
};

export default nextConfig;
