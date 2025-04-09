import { POST_LIMITS } from '../constants';

/**
 * Validates that all code blocks in content are within size limits
 * @param {string} content - The markdown content to validate
 * @returns {boolean} - True if all code blocks are valid, false otherwise
 */
export const validateCodeBlocks = (content) => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const matches = content.match(codeBlockRegex) || [];

  // Ensure code blocks aren't too large
  for (const block of matches) {
    if (block.length > POST_LIMITS.CODE_BLOCK_MAX) {
      return false;
    }
  }
  return true;
};