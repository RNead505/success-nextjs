/**
 * Decodes HTML entities in a string
 * Converts &amp; to &, &lt; to <, &gt; to >, &quot; to ", &#039; to ', etc.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return text;

  // Create a temporary element to use browser's HTML decoding
  if (typeof document !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  // Server-side decoding for all HTML entities including numeric ones
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Decodes HTML entities in rendered HTML content from WordPress
 * This handles content that needs to be used with dangerouslySetInnerHTML
 */
export function decodeHtmlContent(html: string): string {
  if (!html) return html;

  // Decode all HTML entities including numeric ones (&#8217;, &#038;, etc.)
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
}
