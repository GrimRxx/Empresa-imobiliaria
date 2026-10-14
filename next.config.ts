import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 90 é usado na foto da casa, que já vem comprimida da origem.
  images: { qualities: [75, 90] },
};

export default nextConfig;
