import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sacred-snuff.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.sacred-snuff.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.wp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
