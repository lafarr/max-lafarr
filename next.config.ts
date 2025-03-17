import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: '/api/proxy/:path*',
				destination: 'https://maxlafarr.com/api/:path*',
			},
		];
	},
};

export default nextConfig;

