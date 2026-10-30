import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site 100% estático (pasta out/), publicado no Cloudflare Pages. O envio do
  // formulário fica em functions/api/indicacao.ts.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
