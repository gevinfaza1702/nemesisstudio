const nextConfig = {
  reactStrictMode: false,
  // Transpile three.js for Next.js 14 compatibility
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  // Reduce development noise
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Optimize webpack for faster builds
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
