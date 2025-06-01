/**
 * Generates a unique prompt ID based on userId and timestamp
 * Format: {userId}-{timestamp}
 * 
 * @param userId The ID of the user creating the prompt
 * @returns A unique string ID for the prompt
 */
export function generateUniquePromptId(userId: string): string {
  const timestamp = Date.now();
  return `${userId}-${timestamp}`;
}

/**
 * Extracts user ID from a prompt ID
 * 
 * @param promptId The ID of the prompt (format: {userId}-{timestamp})
 * @returns The user ID portion of the prompt ID
 */
export function extractUserIdFromPromptId(promptId: string): string | null {
  const parts = promptId.split('-');
  if (parts.length < 2) return null;
  
  // Remove the last part (timestamp) and join the rest
  // This handles cases where userId itself might contain hyphens
  return parts.slice(0, -1).join('-');
}

/**
 * Extracts timestamp from a prompt ID
 * 
 * @param promptId The ID of the prompt (format: {userId}-{timestamp})
 * @returns The timestamp portion of the prompt ID as a number, or null if invalid
 */
export function extractTimestampFromPromptId(promptId: string): number | null {
  const parts = promptId.split('-');
  if (parts.length < 2) return null;
  
  const timestamp = parseInt(parts[parts.length - 1], 10);
  return isNaN(timestamp) ? null : timestamp;
} 