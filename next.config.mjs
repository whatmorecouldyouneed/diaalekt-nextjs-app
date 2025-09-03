/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  trailingSlash: true, // Required for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
    domains: ['cdn.shopify.com'], // Allow Shopify CDN images
  },
  // Disable server-side features for static export
  experimental: {
    appDir: true,
  },
};

export default nextConfig;

