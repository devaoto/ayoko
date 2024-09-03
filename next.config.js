/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "s4.anilist.co",
        port: "",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "artworks.thetvdb.com",
        port: "",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "media.kitsu.app",
        port: "",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/**",
        protocol: "https",
      },
      {
        hostname: "img1.ak.crunchyroll.com",
        port: "",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
