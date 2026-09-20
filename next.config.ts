import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://va.vercel-scripts.com https://vercel.live",
      "worker-src blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

// Retired courses — send old links/bookmarks/search results to the closest
// remaining course instead of a 404.
const retiredCourseSlugs = [
  "business-communication",
  "basic-communication",
  "communication-skills-intermediate",
  "communication-skills-advanced",
];

const nextConfig: NextConfig = {
  async redirects() {
    return retiredCourseSlugs.map((slug) => ({
      source: `/courses/${slug}`,
      destination: "/courses/communication-skills",
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
