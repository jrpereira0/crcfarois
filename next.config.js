/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "via.placeholder.com", "images.unsplash.com"], // Adicionar domínio do Cloudinary e placeholder
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Aumentar limite de body size para 10MB
    bodySizeLimit: '10mb',
  },
};

module.exports = nextConfig;
