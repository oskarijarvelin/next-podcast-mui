module.exports = {
    reactStrictMode: true,
    experimental: {
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: '**.cloudfront.net',
            },
          ],
        },
    },
};