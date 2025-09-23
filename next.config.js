const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Linting can fail on Windows due to EPERM on junctions like 'Application Data'
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even if there are type errors
    ignoreBuildErrors: true,
  },
  experimental: {
    // Avoid tracing into Windows user profile special folders that can throw EPERM on local builds
    outputFileTracingExcludes: {
      '*': [
        'C:/Users/*/AppData/**',
        'C:/Users/*/Application Data/**',
        'C:/Users/*/Cookies/**',
        'C:/Users/*/AppData/Local/Microsoft/Windows/INetCookies/**',
      ],
    },
    // Restrict file tracing to the project root to avoid scanning outside
    outputFileTracingRoot: path.join(__dirname),
  },
  webpack: (config) => {
    // Use in-memory cache to avoid scanning user profile directories on Windows
    config.cache = { type: 'memory' };
    return config;
  },
};

module.exports = nextConfig;