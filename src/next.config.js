/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["storage.googleapis.com", "obvescevalnik.appspot.com"],
	},
}

module.exports = nextConfig
