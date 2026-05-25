import DOMPurify from "isomorphic-dompurify";

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "a", "ul", "ol", "li", "blockquote",
    "h2", "h3", "h4", "pre", "code", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td", "hr",
  ],
  ALLOWED_ATTR: ["href", "title", "rel", "target", "src", "alt", "class"],
  ALLOWED_URI_REGEXP: /^(https?:\/\/|\/|#)/i,
};

interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

/**
 * THE ONLY PLACE in the codebase that renders raw HTML from the database.
 * Every render goes through DOMPurify before being handed to React.
 * Never use dangerouslySetInnerHTML outside this component.
 */
export function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  const clean = DOMPurify.sanitize(html ?? "", PURIFY_CONFIG);
  // eslint-disable-next-line react/no-danger -- intentional: clean is DOMPurify output
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean as string }}
    />
  );
}
