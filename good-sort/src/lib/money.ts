/** Money is stored as integer cents (AUD) and formatted at the edge. */
export function formatAUD(cents: number): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
