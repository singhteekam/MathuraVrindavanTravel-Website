/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — admin-uploaded images
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Unsplash — free stock photos (no copyright for commercial use)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Wikimedia Commons — public domain / CC licensed temple photos
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      // Google user content (profile avatars from Google OAuth)
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    // Optimize local /public images automatically
    // Supported formats for best compression
    formats: ['image/avif', 'image/webp'],
  },
  allowedDevOrigins: ['192.168.0.107'],  // for development, allow requests from this origin
  serverExternalPackages: ['mongoose'],

}

module.exports = nextConfig