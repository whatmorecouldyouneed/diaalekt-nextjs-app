/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export to enable API routes
  images: {
    unoptimized: true, // Keep this for development
    domains: ['cdn.shopify.com'], // Allow Shopify CDN images
  },
};

export default nextConfig;

