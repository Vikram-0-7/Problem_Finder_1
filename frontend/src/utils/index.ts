/**
 * Format a number with comma separators
 */
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(num >= 10_000 ? 0 : 1)}K`;
  return num.toLocaleString();
};

/**
 * Get severity color class
 */
export const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    Critical: 'text-red-500 bg-red-500/10 border-red-500/25',
    High: 'text-amber-500 bg-amber-500/10 border-amber-500/25',
    Medium: 'text-blue-500 bg-blue-500/10 border-blue-500/25',
    Low: 'text-green-500 bg-green-500/10 border-green-500/25',
  };
  return colors[severity] || colors.Medium;
};

/**
 * Get severity dot color
 */
export const getSeverityDotColor = (severity: string): string => {
  const colors: Record<string, string> = {
    Critical: 'bg-red-500',
    High: 'bg-amber-500',
    Medium: 'bg-blue-500',
    Low: 'bg-green-500',
  };
  return colors[severity] || colors.Medium;
};

/**
 * Get category color
 */
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Healthcare: '#EF4444',
    Education: '#3B82F6',
    Agriculture: '#22C55E',
    Transport: '#F59E0B',
    Finance: '#8B5CF6',
    Environment: '#10B981',
    Technology: '#06B6D4',
    Infrastructure: '#F97316',
  };
  return colors[category] || '#FF6A00';
};

/**
 * Truncate text to a specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Generate a relative time string
 */
export const timeAgo = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateStr);
};

/**
 * Compute pain score from severity
 */
export const getPainScore = (severity: string): number => {
  const scores: Record<string, number> = {
    Critical: 9.5,
    High: 7.5,
    Medium: 5.0,
    Low: 2.5,
  };
  return scores[severity] || 5.0;
};

/**
 * Generate a unique id
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
