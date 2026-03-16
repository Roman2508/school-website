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

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
