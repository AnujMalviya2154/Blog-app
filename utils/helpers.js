'use strict';

/**
 * Format an ISO date string into a human-readable date.
 * Example: "July 16, 2026"
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Return a relative time string from an ISO date.
 * Example: "3 days ago", "Just now"
 */
function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year',   seconds: 31536000 },
    { label: 'month',  seconds: 2592000  },
    { label: 'week',   seconds: 604800   },
    { label: 'day',    seconds: 86400    },
    { label: 'hour',   seconds: 3600     },
    { label: 'minute', seconds: 60       },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

/**
 * Estimate reading time based on average 200 WPM.
 * Example: "3 min read"
 */
function readingTime(content) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

/**
 * Truncate content to a given character limit, breaking at a word boundary.
 * Example: "This is a long post…"
 */
function excerpt(content, maxLength = 150) {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

module.exports = { formatDate, timeAgo, readingTime, excerpt };
