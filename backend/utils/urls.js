// utils/urls.js
const CANONICAL_BASE = "https://diagnosing-skin-diseases.vercel.app";
const LIVE_BASE = "https://diagnosingskindiseases.com";

function rewriteBaseUrlInString(str, targetBase) {
  if (typeof str !== "string") return str;
  if (!str.includes(CANONICAL_BASE)) return str;

  return str.split(CANONICAL_BASE).join(targetBase);
}

module.exports = {
  CANONICAL_BASE,
  LIVE_BASE,
  rewriteBaseUrlInString,
};
