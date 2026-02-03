// utils/deepRewrite.js
const { rewriteBaseUrlInString } = require("./urls");

function deepRewriteUrls(value, targetBase) {
  if (Array.isArray(value)) {
    return value.map((v) => deepRewriteUrls(v, targetBase));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deepRewriteUrls(v, targetBase)])
    );
  }

  if (typeof value === "string") {
    return rewriteBaseUrlInString(value, targetBase);
  }

  return value;
}

module.exports = { deepRewriteUrls };
