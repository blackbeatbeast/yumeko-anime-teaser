import type { NextConfig } from 'next';

const basePath = process.env.GITHUB_PAGES === 'true' ? '/yumeko-anime-teaser' : '';
const nextConfig: NextConfig = {
  ...(basePath ? { output: 'export', assetPrefix: basePath, trailingSlash: true } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
