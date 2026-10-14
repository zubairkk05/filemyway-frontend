/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  // Set to true if deploying a static export to cPanel (Option B in 01).
  // output: "export",
};

export default nextConfig;
