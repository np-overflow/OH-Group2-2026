import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
      {
        source: "/sessions/:path*",
        destination: "http://127.0.0.1:8000/sessions/:path*",
      },
    ];
  },
};

export default nextConfig;
