const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';

const nextConfig = {
  reactStrictMode: false,
  basePath: (isGithubActions && !isCustomDomain) ? '/diaalekt-nextjs-app' : '',
  assetPrefix: (isGithubActions && !isCustomDomain) ? '/diaalekt-nextjs-app' : '',
  images: {
    unoptimized: true,
    loader: 'default',
    domains: [
      'cdn.shopify.com',
      'shopify.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: false,
  output: 'export',
};

export default nextConfig;
