/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''  // Vous pouvez enlever cette ligne si aucun port spécifique n'est requis
      }
    ]
  }
}

module.exports = nextConfig;
