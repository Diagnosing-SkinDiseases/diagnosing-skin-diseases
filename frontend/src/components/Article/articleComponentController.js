import React from "react";
import ArticleContentType from "./enums";
import VideoComponent from "./VideoComponent";
import styles from "./styles";

import DOMPurify from "dompurify";

// Allow only what you need for paragraphs
const SANITIZE_CFG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "span",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "title", "class"],
};

// Add the safe-link hook once (avoid stacking in HMR)
if (typeof window !== "undefined" && !window.__DP_HOOK_ADDED__) {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName === "A") {
      const href = node.getAttribute("href") || "";
      // Kill javascript: etc. (DOMPurify already blocks, this is extra belt)
      if (!/^https?:\/\//i.test(href) && !href.startsWith("#")) {
        node.removeAttribute("href");
      }
      if (!node.getAttribute("target")) node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  window.__DP_HOOK_ADDED__ = true;
}

function sanitize(html) {
  return DOMPurify.sanitize(html, SANITIZE_CFG);
}

/**
 * parseData function parses the article content based on its type.
 * @param {Object} data - The data object containing type and content of the article element.
 * @param {number} index - The index of the article element.
 * @returns {JSX.Element|null} - Returns the JSX element corresponding to the parsed article element, or null if no match.
 */
const parseData = ({ type, content }, index, firstH1Index) => {
  switch (type) {
    case ArticleContentType.HEADER1:
      return (
        <div key={index} id={content} className="art-h1">
          {index !== firstH1Index && <hr className="art-hr" />}
          <h2>{content}</h2>
        </div>
      );
    case ArticleContentType.HEADER2:
      return (
        <div key={index} id={content}>
          <h2 className="art-h2">{content}</h2>
        </div>
      );
    case ArticleContentType.SUBTYPE:
      return (
        <div key={index} id={content} className="art-subtype">
          <h1>{content}</h1>
        </div>
      );
    case ArticleContentType.PARAGRAPH: {
      let html = content;

      // Only do newline-><br> for plain text
      const hasTags = /<\s*[a-zA-Z]/.test(html);
      if (!hasTags) html = html.replace(/\n/g, "<br>");

      // Optional: upgrade bare <a> to safe link before sanitize, but the hook handles it.
      // html = html.replace(/<a\s+href="(.*?)">(.*?)<\/a>/g,
      //   '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');

      const clean = sanitize(html);

      // If the (sanitized) HTML contains block tags, don't wrap in <p>
      const hasBlock =
        /<(p|div|ul|ol|li|h[1-6]|blockquote|pre|table|hr)\b/i.test(clean);
      const Wrapper = hasBlock ? "div" : "p";

      return (
        <Wrapper
          className="art-p"
          key={index}
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      );
    }
    case ArticleContentType.IMAGE:
      return (
        <div key={index} className="container">
          <img src={`${content}`} alt="Converted" className="d-block mx-auto" />
        </div>
      );
    case ArticleContentType.VIDEO:
      // Function to extract YouTube video ID from URL

      function extractVimeoIframeSrc(input) {
        // If they pasted just a URL, accept it directly.
        try {
          const u = new URL(input.trim());
          if (u.hostname.includes("vimeo.com")) return u.toString();
        } catch {}

        // Prefer DOM parsing (browser)
        if (typeof window !== "undefined" && "DOMParser" in window) {
          const doc = new DOMParser().parseFromString(
            String(input),
            "text/html"
          );
          const iframe = doc.querySelector('iframe[src*="vimeo.com"]');
          if (iframe) {
            let src = iframe.getAttribute("src") || "";
            src = src.replace(/&amp;/g, "&").trim(); // decode entities
            try {
              return new URL(src, "https://player.vimeo.com").toString();
            } catch {
              return src;
            }
          }
        }

        // Fallback: regex
        const m = String(input).match(/<iframe[^>]+src=["']([^"']+)["']/i);
        if (m) {
          let src = m[1].replace(/&amp;/g, "&").trim();
          try {
            return new URL(src, "https://player.vimeo.com").toString();
          } catch {
            return src;
          }
        }

        return null; // not found
      }

      let videoSrc = extractVimeoIframeSrc(content);

      return <VideoComponent key={index} videoSrc={videoSrc}></VideoComponent>;
    case ArticleContentType.SUBTITLE:
      return (
        <p key={index} style={styles.subtitle}>
          {content}
        </p>
      );
    default:
      return null;
  }
};

/**
 * generateSummary function creates a summary with hyperlinks to headers within the article.
 * @param {Array} content - An array containing objects representing different types of content in the article.
 * @returns {JSX.Element} - Returns a JSX element for the summary.
 */
const generateSummary = (content) => {
  return (
    <div>
      <ul className="summary-list">
        {content
          .filter((item) => item.type === ArticleContentType.HEADER1)
          .map(({ content }, index) => (
            <li key={index}>
              <a href={`#${content}`} className="summary-link">
                {content}
              </a>
            </li>
          ))}
      </ul>

      {/* SUBTYPE summary */}
      <ul className="subtype-list">
        {content
          .filter((item) => item.type === ArticleContentType.SUBTYPE)
          .map(({ content }, index) => (
            <li key={`sub-${index}`}>
              <a href={`#${content}`} className="summary-link">
                {content}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
};

/**
 * renderError function renders an error message with a dynamic email link.
 * @param {string} message - The error message containing a placeholder for email.
 * @param {string} email - The email address to be included in the message.
 * @returns {JSX.Element} - Returns a JSX element for the error message.
 */
const renderError = (message, email) => {
  const parts = message.split("emailAddress");
  return (
    <>
      {parts[0]}
      <a href={`mailto:${email}`}>{email}</a>
      {parts[1]}
    </>
  );
};

export { parseData, generateSummary, renderError };
