import { trackEvent } from "./GA4";

const shouldTrackPath = (path) => {
  const blockedPathKeywords = ["/admin", "/mfa-"];
  if (!path) return true;

  for (const keyword of blockedPathKeywords) {
    if (path.includes(keyword)) {
      return false;
    }
  }

  return true;
};

export const trackNavClick = ({ label, level, path }) => {
  console.log("trackNavClick", { label, level, path });

  // Skip tracking if path matches blocked keywords
  if (!shouldTrackPath(path)) {
    console.log("nav_click blocked for path:", path);
    return;
  }

  trackEvent("nav_click", {
    label,
    level,
    path,
  });
};
