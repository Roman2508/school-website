import React from "react";

/**
 * Parses text and wraps words in [brackets] with a gradient span.
 * @param text The text to format.
 * @returns JSX.Element | (string | JSX.Element)[] | null
 */
export function formatRichText(text: string | null | undefined) {
  if (!text) return null;

  // Regex to find content inside [brackets]
  const parts = text.split(/(\[.*?\])/g);

  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      const content = part.slice(1, -1);
      return (
        <span key={index} className="stats-gradient">
          {content}
        </span>
      );
    }
    return part;
  });
}
