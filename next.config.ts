// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  allowedDevOrigins: ['192.168.0.107'],  // for development, allow requests from this origin
  serverExternalPackages: ['mongoose'],
  // experimental: {
  //   serverComponentsExternalPackages: ['mongoose'],
  // },
  // Silence Mongoose "Critical dependency" warnings at build time
  webpack: (config: any) => {
    config.externals = [...(config.externals || []), 'mongoose']
    return config
  },
}
 
module.exports = nextConfig