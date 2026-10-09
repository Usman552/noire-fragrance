import type { NextConfig } from "next";

/**
 * GitHub Pages build (set by .github/workflows/deploy.yml).
 * Pages serves static files from /<repo>/, so that build is a static export
 * under a base path. Local `npm run dev` / `npm start` are unaffected.
 */
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? process.env.PAGES_BASE_PATH ?? "/noire-fragrance" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(pages && { output: "export", basePath, trailingSlash: true }),
  images: {
    // Static hosting has no image optimiser; files are pre-sized in /public/images.
    unoptimized: pages,
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tree-shake icon imports.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
