import type { NextConfig } from 'next';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `${API_URL}/api/:slug*`,
      }
    ]
  }
};

export default nextConfig;
