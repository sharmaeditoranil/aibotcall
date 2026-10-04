/**
 * Normalizes phone numbers to E.164 standard.
 * Special handling for Indian numbers (+91), common formats, and international prefix.
 */
export function normalizePhoneNumber(rawPhone: string, defaultCountryCode = '91'): {
  isValid: boolean;
  e164: string;
  error?: string;
} {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { isValid: false, e164: '', error: 'Phone number is empty or not a string' };
  }

  // Remove whitespace, dashes, parens, brackets, dots
  let cleaned = rawPhone.replace(/[\s\-\(\)\.\,\/]/g, '').trim();

  // If starts with +, strip + temporarily for numeric check
  const hasPlus = cleaned.startsWith('+');
  if (hasPlus) {
    cleaned = cleaned.substring(1);
  }

  // Remove leading 0s for domestic representation (e.g. 09876543210 -> 9876543210)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, e164: '', error: 'Phone number contains invalid non-digit characters' };
  }

  // Case 1: Indian 10-digit mobile number (starts with 6, 7, 8, 9)
  if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, e164: `+${defaultCountryCode}${cleaned}` };
  }

  // Case 2: Indian 12-digit mobile number starting with 91
  if (cleaned.length === 12 && cleaned.startsWith('91') && /^91[6-9]\d{9}$/.test(cleaned)) {
    return { isValid: true, e164: `+${cleaned}` };
  }

  // Case 3: Other international numbers with length 10 to 15
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return { isValid: true, e164: `+${cleaned}` };
  }

  return {
    isValid: false,
    e164: '',
    error: `Invalid phone number length (${cleaned.length} digits). Expected standard 10-digit or E.164 phone.`,
  };
}
