/** @type {import('next').NextConfig} */

// next.config.js
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  i18n,
};

module.exports = nextConfig;
