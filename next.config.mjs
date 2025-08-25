/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export to enable API routes
  images: {
    unoptimized: true, // Keep this for development
  },
};

export default nextConfig;

