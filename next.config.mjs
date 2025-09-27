const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  reactStrictMode: false,
  basePath: isGithubActions ? '/diaalekt-nextjs-app' : '',
  assetPrefix: isGithubActions ? '/diaalekt-nextjs-app' : '',
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
