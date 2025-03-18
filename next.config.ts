import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ['7x0zshh65t.ufs.sh']
	},
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

