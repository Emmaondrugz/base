const { networkInterfaces } = require("node:os");

const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((interfaceAddress) => {
    if (!interfaceAddress || interfaceAddress.family !== "IPv4" || interfaceAddress.internal) {
      return false;
    }

    const [first, second] = interfaceAddress.address.split(".").map(Number);
    return (
      first === 10 ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168)
    );
  })
  .map((interfaceAddress) => interfaceAddress.address);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: lanAddresses,
  devIndicators: false,
};

module.exports = nextConfig;
