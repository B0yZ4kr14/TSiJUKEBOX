import { parseISO, isValid } from 'date-fns';

/**
 * Safely parse an ISO date string, returning null if invalid or missing.
 * Prevents crashes from null/undefined dates in API responses.
 */
export function safeParseISO(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    console.warn('[date-utils] Invalid date string:', dateString);
    return null;
  }
}

/**
 * Safely format a date, returning a fallback string if the date is invalid.
 */
export function safeFormatDate(
  dateString: string | null | undefined,
  formatFn: (date: Date) => string,
  fallback: string = 'N/A'
): string {
  const date = safeParseISO(dateString);
  if (!date) return fallback;
  
  try {
    return formatFn(date);
  } catch {
    console.warn('[date-utils] Failed to format date:', dateString);
    return fallback;
  }
}
