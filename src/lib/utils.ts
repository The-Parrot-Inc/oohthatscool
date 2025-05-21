// Utility functions for Astro components

/**
 * Helper to format dates consistently
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Helper to format times consistently
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
}