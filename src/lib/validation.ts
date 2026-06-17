// Australian-specific input validation. Pure functions, ready to wire into the
// client/business settings and booking forms.
// TODO(future): use these in the client intake + business settings forms.

/**
 * Validates an Australian mobile or landline number. Accepts spaces and an
 * optional +61 country code; normalises before checking.
 *   0412 345 678, +61 412 345 678, (02) 9876 5432
 */
export function isValidAuPhone(input: string): boolean {
  const digits = input.replace(/[\s()+-]/g, '');
  // 61 -> national leading 0
  const national = digits.startsWith('61') ? `0${digits.slice(2)}` : digits;
  // Mobiles: 04xxxxxxxx. Landlines: 0[2378]xxxxxxxx. Both are 10 digits.
  return /^0(4\d{8}|[2378]\d{8})$/.test(national);
}

/**
 * Validates an ABN using the ATO weighted-checksum algorithm.
 * Accepts spaces (e.g. "51 824 753 556").
 */
export function isValidABN(input: string): boolean {
  const digits = input.replace(/\s/g, '');
  if (!/^\d{11}$/.test(digits)) return false;
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const sum = digits
    .split('')
    .map(Number)
    // Subtract 1 from the first digit before applying weights.
    .reduce((acc, n, i) => acc + (i === 0 ? n - 1 : n) * weights[i], 0);
  return sum % 89 === 0;
}
