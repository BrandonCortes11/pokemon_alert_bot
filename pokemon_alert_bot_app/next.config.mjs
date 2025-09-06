/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['puppeteer'],
  images: {
    domains: ['assets.pokemon.com', 'i5.walmartimages.com', 'target.scene7.com', 'pisces.bbystatic.com']
  }
};

export default nextConfig;