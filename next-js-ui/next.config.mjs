// next.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['baselib'],
  webpack: (config) => {
    config.resolve.alias['@baselib'] = path.resolve(__dirname, '../baselib');
    return config;
  },
};

export default nextConfig;
