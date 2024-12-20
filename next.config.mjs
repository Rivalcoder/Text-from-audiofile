// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: '10mb', // Adjust the limit as needed
      },
    },
  };
  
  export default nextConfig;