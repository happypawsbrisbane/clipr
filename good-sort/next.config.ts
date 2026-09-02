import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This app is nested in a repo that has its own lockfile at the root, so pin
  // the workspace root rather than letting Turbopack infer the wrong one.
  turbopack: { root: path.dirname(new URL(import.meta.url).pathname) },
};

export default nextConfig;
