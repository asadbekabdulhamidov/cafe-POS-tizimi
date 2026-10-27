/**
 * Utility functions for currency and date formatting
 */

/**
 * Format a number to Uzbek Som currency format (e.g., 30 000 so'm)
 * @param {number|string} amount
 * @param {boolean} includeSuffix - whether to include "so'm" suffix
 * @returns {string}
 */
export function formatCurrency(amount, includeSuffix = true) {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString('uz-UZ').replace(/,/g, ' ');
  return includeSuffix ? `${formatted} so'm` : formatted;
}

/**
 * Format an ISO date string or Date object to a readable date string
 * @param {string|Date} date
 * @returns {string} e.g. "27.10.2026, 14:30"
 */
export function formatDateTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

/**
 * Format time only (e.g., "14:30")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format relative time (e.g. "12 daqiqa oldin")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Hozirgina';
  if (diffInMinutes < 60) return `${diffInMinutes} daqiqa oldin`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} soat oldin`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} kun oldin`;
}

/**
 * Generate a unique ID with optional prefix
 * @param {string} prefix
 * @returns {string}
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
