/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next-vercel')
module.exports = {
  reactStrictMode: true,
  i18n,
  target: 'serverless',
}
