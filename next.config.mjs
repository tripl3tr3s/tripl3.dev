/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
  assetPrefix: '',
  images: {
    unoptimized: true,
  },
  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
