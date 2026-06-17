/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 앱인토스(.ait) 번들은 정적 웹 결과물(out/)을 패키징합니다.
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
