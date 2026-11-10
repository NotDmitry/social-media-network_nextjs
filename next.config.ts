import type { NextConfig } from 'next';

const API_URL = process.env.API_URL;

const nextConfig: NextConfig = {
  rewrites() {
    return API_URL ? [
      {
        source: '/api/:slug*',
        destination: `${API_URL}/api/:slug*`,
      }
    ] : [];
  }
};

export default nextConfig;
