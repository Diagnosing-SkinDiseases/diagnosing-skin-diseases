const testApi = import.meta.env.VITE_TEST_API;
const hostedApi = import.meta.env.VITE_HOSTED_API;
const isProduction = import.meta.env.PROD;
const configuredApiUrl = isProduction ? hostedApi : testApi;

if (!configuredApiUrl) {
  throw new Error(
    `Missing ${isProduction ? "VITE_HOSTED_API" : "VITE_TEST_API"} configuration`,
  );
}

let parsedApiUrl;
try {
  parsedApiUrl = new URL(configuredApiUrl);
} catch {
  throw new Error("The configured API URL must be an absolute URL");
}

const apiHostname = parsedApiUrl.hostname.toLowerCase();
const isLoopbackApiHost =
  apiHostname === "localhost" ||
  apiHostname === "0.0.0.0" ||
  apiHostname === "::1" ||
  apiHostname === "[::1]" ||
  apiHostname.startsWith("127.");

if (
  isProduction &&
  (parsedApiUrl.protocol !== "https:" || isLoopbackApiHost)
) {
  throw new Error("VITE_HOSTED_API must be a public HTTPS URL in production");
}

const apiUrl = configuredApiUrl.replace(/\/+$/, "");

export default apiUrl;
