import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old WordPress URLs end in "/", keep them identical so Google rankings carry over.
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/listing-category/:slug/", destination: "/businesses/?category=:slug", permanent: true },
      { source: "/location/:slug/", destination: "/businesses/?location=:slug", permanent: true },
      { source: "/list-tags/:slug/", destination: "/businesses/?q=:slug", permanent: true },
      { source: "/listing/", destination: "/businesses/", permanent: true },
      { source: "/search-filter/", destination: "/businesses/", permanent: true },
      { source: "/add-listing/", destination: "/submit-listing/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
