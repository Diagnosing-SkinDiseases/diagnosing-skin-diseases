const { findUrls } = require("../utils/findUrls");

function responseUrlRewrite(req, res, next) {
  console.log("[MW] ACCESS:", req.method, req.originalUrl);

  const originalJson = res.json.bind(res);

  res.json = (data) => {
    console.log("[MW] JSON CALLED");

    const urls = findUrls(data);

    if (urls.length > 0) {
      console.log("[MW] URLs FOUND:");
      urls.forEach((u) => console.log("   →", u));
    } else {
      console.log("[MW] NO URLS FOUND");
    }

    return originalJson(data);
  };

  next();
}

module.exports = responseUrlRewrite;
