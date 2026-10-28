/**
 * Utility functions for currency and date formatting
 * Supports both Uzbek Latin and Cyrillic
 */

/**
 * Format a number to Uzbek Som currency format (e.g., 30 000 so‘m or 30 000 сўм)
 * @param {number|string} amount
 * @param {boolean} includeSuffix - whether to include currency suffix
 * @param {string|null} lang - 'latn' or 'cyrl'
 * @returns {string}
 */
export function formatCurrency(amount, includeSuffix = true, lang = null) {
  const currentLang =
    lang ||
    (typeof localStorage !== 'undefined'
      ? localStorage.getItem('choyxona_lang') || 'latn'
      : 'latn');
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString('uz-UZ').replace(/,/g, ' ');
  const suffix = currentLang === 'cyrl' ? 'сўм' : 'so‘m';
  return includeSuffix ? `${formatted} ${suffix}` : formatted;
}

/**
 * Format quantity with its unit (e.g., "1.3 kg" or "3 dona")
 * @param {number|string} quantity
 * @param {string} unit - 'dona', 'kg', 'l', 'porsiya'
 * @param {string|null} lang
 * @returns {string}
 */
export function formatQuantity(quantity, unit = 'dona', lang = null) {
  const currentLang =
    lang ||
    (typeof localStorage !== 'undefined'
      ? localStorage.getItem('choyxona_lang') || 'latn'
      : 'latn');
  const isCyrl = currentLang === 'cyrl';
  const num = Number(quantity) || 0;

  // Format decimal smoothly without unnecessary trailing zeros
  const numStr = Number.isInteger(num) ? String(num) : String(Math.round(num * 100) / 100);

  if (unit === 'kg') {
    return `${numStr} ${isCyrl ? 'кг' : 'kg'}`;
  }
  if (unit === 'l' || unit === 'litr') {
    return `${numStr} ${isCyrl ? 'л' : 'L'}`;
  }
  if (unit === 'porsiya') {
    return `${numStr} ${isCyrl ? 'порция' : 'porsiya'}`;
  }
  return `${numStr} ${isCyrl ? 'дона' : 'dona'}`;
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
 * Format relative time (e.g. "12 daqiqa oldin" / "12 дақиқа олдин")
 * @param {string|Date} date
 * @param {string|null} lang
 * @returns {string}
 */
export function formatRelativeTime(date, lang = null) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';

  const currentLang =
    lang ||
    (typeof localStorage !== 'undefined'
      ? localStorage.getItem('choyxona_lang') || 'latn'
      : 'latn');
  const isCyrl = currentLang === 'cyrl';

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return isCyrl ? 'Ҳозиргина' : 'Hozirgina';
  if (diffInMinutes < 60) return `${diffInMinutes} ${isCyrl ? 'дақиқа олдин' : 'daqiqa oldin'}`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ${isCyrl ? 'соат олдин' : 'soat oldin'}`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${isCyrl ? 'кун олдин' : 'kun oldin'}`;
}

/**
 * Generate a unique ID with optional prefix
 * @param {string} prefix
 * @returns {string}
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}
