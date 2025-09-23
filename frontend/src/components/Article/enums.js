/**
 * Enum representing different types of content in an article.
 * @readonly
 * @enum {string}
 */
const ArticleContentType = {
  /**
   * Represents a level 1 header.
   */
  HEADER1: "HEADER1",

  /**
   * Represents a level 2 header.
   */
  HEADER2: "HEADER2",

  /**
   * Represents a subtype.
   */
  SUBTYPE: "SUBTYPE",

  /**
   * Represents a paragraph of text.
   */
  PARAGRAPH: "PARAGRAPH",
  /**
   * Represents a video.
   */
  VIDEO: "VIDEO",

  /**
   * Represents an image.
   */
  IMAGE: "IMAGE",

  /**
   * Represents a subtitle.
   */
  SUBTITLE: "SUBTITLE",
};

export default ArticleContentType;
