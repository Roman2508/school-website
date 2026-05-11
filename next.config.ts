import type { NextConfig } from "next"

const isDev = process.env.NODE_ENV !== "production"

const nextConfig: NextConfig = {
  images: {
    unoptimized: isDev,
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/uploads/**",
      },
    ],
  },
}

export default nextConfig
