import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faLink,
  faUnlink,
  faBold,
  faItalic,
  faParagraph,
  faFont,
  faArrowTurnDown,
  faLevelDown,
  faLevelDownAlt,
} from "@fortawesome/free-solid-svg-icons";

// ---- DOMPurify config & hooks (register once) ----
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

// Hook runs once; do not add inside sanitize()
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.nodeName === "A") {
    const a = node;
    const href = a.getAttribute("href") || "";
    const isHttp = /^https?:\/\//i.test(href);
    if (isHttp && !a.getAttribute("target")) a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  }
});

function sanitize(html) {
  return DOMPurify.sanitize(html, SANITIZE_CFG);
}

// ---- caret utility ----
function placeCaretAtEnd(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

export default function ParagraphEditor({ value, onChange }) {
  const [mode, setMode] = useState("clean"); // "clean" | "raw"
  const [text, setText] = useState(value || "");
  const cleanRef = useRef(null);
  const rawRef = useRef(null);

  // Seed the clean (contentEditable) surface only when entering Clean mode
  useEffect(() => {
    if (mode === "clean" && cleanRef.current) {
      cleanRef.current.innerHTML = sanitize(text);
      // optional: put caret at end on first entry
      placeCaretAtEnd(cleanRef.current);
    }
  }, [mode]); // if you want to re-seed when external `value` changes, widen deps

  // Keep internal state in sync if parent value changes externally
  useEffect(() => {
    setText(normalizeToParagraph(value) || "");
    if (mode === "clean" && cleanRef.current) {
      cleanRef.current.innerHTML = sanitize(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // once on mount
  useEffect(() => {
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {}
  }, []);

  function normalizeToParagraph(html) {
    const trimmed = (html || "").trim();

    // If it already starts with <p>, <ul>, <ol>, <blockquote>, etc., leave it
    if (/^<(p|ul|ol|blockquote|pre|h[1-6])[\s>]/i.test(trimmed)) {
      return trimmed;
    }

    // If it's empty string, return a blank <p>
    if (trimmed === "") {
      return "<p></p>";
    }

    // Otherwise, wrap in a paragraph
    return `<p>${trimmed}</p>`;
  }

  // optional: shift+Enter = <br>
  const handleCleanKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
  };

  function ensureParagraphAroundSelection() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    // Find a reasonable element from the selection
    const node = sel.anchorNode;
    const el = node && (node.nodeType === 1 ? node : node.parentElement);
    if (!el) return;

    // If we're still inside an LI, do nothing
    if (el.closest("li")) return;

    // Otherwise, format the current block as a <p>
    try {
      document.execCommand("formatBlock", false, "p");
    } catch {}
  }

  // ---- Clean mode (contentEditable) handlers ----
  const handleCleanInput = (e) => {
    // trust the browser while typing; no DOM rewrite
    const dirty = e.currentTarget.innerHTML;
    setText(dirty);
  };

  // keep sanitizing at the edges:
  const handleCleanPaste = (e) => {
    e.preventDefault();
    const pasted =
      e.clipboardData.getData("text/html") ||
      e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, sanitize(pasted)); // sanitize pasted chunk only
  };

  const handleCleanBlur = () => {
    const el = cleanRef.current;
    if (!el) return;
    const clean = sanitize(el.innerHTML);
    if (clean !== el.innerHTML) {
      el.innerHTML = clean; // one rewrite, not per keystroke
    }
    setText(clean);
    onChange(clean); // store sanitized
  };

  // ---- Raw mode (textarea) handlers ----
  const handleRawChange = (e) => setText(e.target.value);
  const handleRawBlur = () => onChange(sanitize(text));

  // ---- Toolbar actions for both modes ----
  const applyInClean = (cmd, arg) => document.execCommand(cmd, false, arg);

  const wrapInRaw = (before, after = "") => {
    const ta = rawRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const sel = v.slice(s, e);
    const next = v.slice(0, s) + before + sel + after + v.slice(e);
    setText(next);
    requestAnimationFrame(() => {
      ta.focus();
      const cursor = s + before.length + sel.length;
      ta.setSelectionRange(cursor, cursor);
    });
  };

  function listifyRaw(ordered = false) {
    const ta = rawRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const startLine = v.lastIndexOf("\n", s - 1) + 1;
    const endLine = v.indexOf("\n", e);
    const end = endLine === -1 ? v.length : endLine;
    const block = v.slice(startLine, end);
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const items = lines.map((l) => `<li>${l}</li>`).join("");
    const wrapped = ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
    const next = v.slice(0, startLine) + wrapped + v.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = startLine + wrapped.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  function removeLinkRaw() {
    const ta = rawRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const open = v.lastIndexOf("<a", s);
    const close = v.indexOf("</a>", e);
    if (open !== -1 && close !== -1) {
      const openEnd = v.indexOf(">", open) + 1;
      const inner = v.slice(openEnd, close);
      const next = v.slice(0, open) + inner + v.slice(close + 4);
      setText(next);
      requestAnimationFrame(() => {
        ta.focus();
        const pos = open + inner.length;
        ta.setSelectionRange(pos, pos);
      });
    }
  }

  const actions = {
    bold: () =>
      mode === "clean"
        ? applyInClean("bold")
        : wrapInRaw("<strong>", "</strong>"),
    italic: () =>
      mode === "clean" ? applyInClean("italic") : wrapInRaw("<em>", "</em>"),
    ul: () => {
      if (mode === "clean") {
        applyInClean("insertUnorderedList");
        // fix the “unlist leaves no <p>” case
        requestAnimationFrame(() => {
          ensureParagraphAroundSelection();
        });
      } else {
        listifyRaw(false);
      }
    },
    link: () => {
      const url = prompt("Enter URL");
      if (!url) return;
      if (mode === "clean") {
        applyInClean("createLink", url);
        const sel = window.getSelection();
        const a =
          sel && sel.anchorNode
            ? sel.anchorNode.parentElement?.closest("a")
            : null;
        if (a) {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
      } else {
        wrapInRaw(
          `<a href="${url}" target="_blank" rel="noopener noreferrer">`,
          "</a>"
        );
      }
    },
    unlink: () => (mode === "clean" ? applyInClean("unlink") : removeLinkRaw()),
    br: () =>
      mode === "clean" ? applyInClean("insertLineBreak") : wrapInRaw("<br>"),
  };

  const toggleMode = () => setMode((m) => (m === "clean" ? "raw" : "clean"));

  return (
    <div className="art-paragraph">
      <label className="label">Paragraph</label>

      <div
        className="pe-toolbar"
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          margin: "6px 0",
        }}
      >
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={actions.bold}
          className="art-paragraph-editor-btn button"
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={actions.italic}
          className="art-paragraph-editor-btn button"
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={actions.ul}
          className="art-paragraph-editor-btn button"
        >
          <FontAwesomeIcon icon={faList} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={actions.link}
          className="art-paragraph-editor-btn button"
        >
          <FontAwesomeIcon icon={faLink} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={actions.unlink}
          className="art-paragraph-editor-btn button"
        >
          <FontAwesomeIcon icon={faUnlink} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={actions.br}
          className="art-paragraph-editor-btn button"
        >
          <FontAwesomeIcon icon={faLevelDownAlt} />
        </button>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="art-paragraph-editor-btn button"
          onClick={toggleMode}
        >
          {mode === "clean" ? "</>" : <FontAwesomeIcon icon={faFont} />}
        </button>
      </div>

      {mode === "clean" ? (
        <div
          ref={cleanRef}
          className="pe-surface"
          contentEditable
          suppressContentEditableWarning
          onInput={handleCleanInput}
          onPaste={handleCleanPaste}
          onBlur={handleCleanBlur}
          onKeyDown={handleCleanKeyDown}
          style={{
            minHeight: 160,
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 10,
            lineHeight: 1.5,
            background: "#fff",
          }}
        />
      ) : (
        <textarea
          ref={rawRef}
          className="pe-raw"
          value={text}
          onChange={handleRawChange}
          onBlur={handleRawBlur}
          rows={6}
          style={{
            width: "100%",
            minHeight: 160,
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 10,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
            lineHeight: 1.4,
          }}
          aria-label="Raw HTML editor"
        />
      )}

      <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
        Mode:{" "}
        <strong>
          {mode === "clean"
            ? "Clean (editable, rendered & sanitized)"
            : "Raw (editable HTML source)"}
        </strong>
      </div>
    </div>
  );
}
