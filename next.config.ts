import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "gcgfmpuxftoaxzuawopk.supabase.co",
      },
      {
        protocol: "https",
        hostname: "canto-wp-media.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
