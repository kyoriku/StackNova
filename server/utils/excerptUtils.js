// utils/excerptUtils.js
const generateExcerpt = (content, maxLength = 150) => {
  if (!content) return '';
  
  // Split into paragraphs and take the first one
  const firstParagraph = content.split(/\n\n/)[0] || content;
  
  // Remove all markdown formatting
  const cleanedText = firstParagraph
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove bold and italic
    .replace(/[*_]{1,3}(.*?)[*_]{1,3}/g, '$1')
    // Remove code blocks
    .replace(/`{1,3}.*?`{1,3}/g, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove blockquotes
    .replace(/^>\s*/gm, '')
    // Remove heading marks
    .replace(/^#{1,6}\s+/gm, '')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove lists
    .replace(/^[\d-*+]\.\s+/gm, '')
    // Clean up whitespace
    .replace(/\s+/g, ' ')
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