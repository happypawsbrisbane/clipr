import { describe, expect, it } from 'vitest';
import { isValidABN, isValidAuPhone } from './validation';

describe('isValidAuPhone', () => {
  it('accepts mobiles, landlines and +61 forms', () => {
    expect(isValidAuPhone('0412 345 678')).toBe(true);
    expect(isValidAuPhone('+61 412 345 678')).toBe(true);
    expect(isValidAuPhone('(02) 9876 5432')).toBe(true);
  });

  it('rejects malformed numbers', () => {
    expect(isValidAuPhone('1234')).toBe(false);
    expect(isValidAuPhone('0512 345 678')).toBe(false);
  });
});

describe('isValidABN', () => {
  it('accepts a valid ABN (with spaces)', () => {
    expect(isValidABN('51 824 753 556')).toBe(true);
  });

  it('rejects an invalid checksum', () => {
    expect(isValidABN('51 824 753 557')).toBe(false);
    expect(isValidABN('12345')).toBe(false);
  });
});
