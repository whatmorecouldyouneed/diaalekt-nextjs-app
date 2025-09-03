/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  trailingSlash: true, // Good for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
    domains: ['cdn.shopify.com'],
  },
};

export default nextConfig;
