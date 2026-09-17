import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flooreno.ca",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.flooreno.ca",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
