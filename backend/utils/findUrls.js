// utils/findUrls.js
const CANONICAL_BASE = "https://diagnosing-skin-diseases.vercel.app";
const LIVE_BASE = "https://diagnosingskindiseases.com";

function findUrls(value, found = [], seen = new WeakSet()) {
  if (value === null || value === undefined) return found;

  // STRING
  if (typeof value === "string") {
    // Skip base64 images
    if (value.startsWith("data:image")) return found;

    if (value.includes(CANONICAL_BASE)) {
      found.push(value);

      // 🔍 LIVE PREVIEW (NO MUTATION)
      const preview = value.split(CANONICAL_BASE).join(LIVE_BASE);

      console.log("[MW] URL FOUND:");
      console.log("   PROD :", truncate(value));
      console.log("   LIVE :", truncate(preview));
    }

    return found;
  }

  // NON-OBJECT
  if (typeof value !== "object") return found;

  // CYCLE DETECTION
  if (seen.has(value)) return found;
  seen.add(value);

  // ARRAY
  if (Array.isArray(value)) {
    for (const item of value) {
      findUrls(item, found, seen);
    }
    return found;
  }

  // OBJECT
  for (const key of Object.keys(value)) {
    findUrls(value[key], found, seen);
  }

  return found;
}

// Helper: keep logs readable
function truncate(str, max = 120) {
  if (str.length <= max) return str;
  return str.slice(0, max) + "…";
}

module.exports = { findUrls };
