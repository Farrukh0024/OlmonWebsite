export function formatPhoneNumber(input: string): string {
  // Remove all non-digit characters except +
  let cleaned = input.replace(/[^\d+]/g, '');
  
  // Ensure the number starts with +998
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  if (!cleaned.startsWith('+998') && cleaned.length > 3) {
    cleaned = '+998' + cleaned.slice(cleaned.startsWith('+') ? 1 : 0);
  }

  // Format the number: +998 XX XXX XX XX
  if (cleaned.length > 4) {
    cleaned = cleaned.slice(0, 4) + ' ' + cleaned.slice(4);
  }
  if (cleaned.length > 7) {
    cleaned = cleaned.slice(0, 7) + ' ' + cleaned.slice(7);
  }
  if (cleaned.length > 11) {
    cleaned = cleaned.slice(0, 11) + ' ' + cleaned.slice(11);
  }
  if (cleaned.length > 14) {
    cleaned = cleaned.slice(0, 14) + ' ' + cleaned.slice(14);
  }

  // Limit to maximum length
  return cleaned.slice(0, 17);
}

export function validatePhoneNumber(phone: string): boolean {
  // Allow both formats: with or without +998 prefix
  const phoneRegex = /^(?:\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{2}\s?\d{2})$/;
  return phoneRegex.test(phone);
}