const isProduction =
  process.env.NODE_ENV?.trim().toLowerCase() === "production";

module.exports = { isProduction };
