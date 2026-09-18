import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // รูปประกอบทั้งหมดดึงจาก Unsplash — เว็บจึงต้องต่ออินเทอร์เน็ตจึงจะเห็นรูป
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
