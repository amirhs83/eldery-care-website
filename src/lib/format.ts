// Persian number + formatting helpers

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert any number/string digits to Persian digits. */
export function toFa(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** Format a number with thousands separators, then Persian digits. */
export function toFaNum(n: number): string {
  return toFa(n.toLocaleString("en-US"));
}

/** Persian ordinal-ish label for waitlist position: "۵۲۷مین" */
export function toFaOrdinal(n: number): string {
  return `${toFa(n)}مین`;
}
