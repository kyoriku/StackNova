const generateExcerpt = (content, maxLength = 125) => {
  if (!content) return '';

  // Split into paragraphs and take the first one
  const firstParagraph = content.split(/\n\n/)[0] || content;

  // Remove all markdown formatting
  const cleanedText = firstParagraph
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1') // Remove bold and italic
    .replace(/`{1,3}.*?`{1,3}/g, '') // Remove code blocks
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/^>\s*/gm, '') // Remove blockquotes
    .replace(/^#{1,6}\s+/gm, '') // Remove heading marks
    .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
    .replace(/^[\d-*+]\.\s+/gm, '') // Remove lists
    .replace(/\s+/g, ' ') // Clean up whitespace
    .trim();

  if (cleanedText.length <= maxLength) {
    return cleanedText;
  }

  // Cut at the last complete sentence or word
  const truncated = cleanedText.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  const cutoff = lastPeriod > maxLength * 0.5 ? lastPeriod + 1 : lastSpace;
  return cutoff > 0 ? truncated.slice(0, cutoff).trim() + '...' : truncated + '...';
};

module.exports = { generateExcerpt };