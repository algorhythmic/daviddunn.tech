/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'daviddunn.tech'],
    },
  },
  serverExternalPackages: ['sharp'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    domains: [
      'prettymapp.streamlit.app',
      'storage.googleapis.com',
      'gw-quickview.streamlit.app',
      'd3qpg5syynu736.cloudfront.net',
      'images.unsplash.com',
      'd1sm5qgpqx3jlp.cloudfront.net',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd1sm5qgpqx3jlp.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prettymapp.streamlit.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gw-quickview.streamlit.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'd3qpg5syynu736.cloudfront.net',
        port: '',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // Suppress the punycode deprecation warning
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
    ];
    config.resolve.fallback = { fs: false };
    return config;
  },
  transpilePackages: ['@uiw/react-md-editor'],
}

module.exports = nextConfig
