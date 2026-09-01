/**
 * A curated list of countries for the phone field: dial code + the expected
 * number of digits in the national number (min/max). This lets us validate
 * "a real phone number for this country" without a heavyweight library.
 *
 * `min`/`max` are the national significant number length (excluding the dial
 * code). Ranges are deliberately a little generous to avoid false rejections.
 */
export interface Country {
  code: string; // ISO
  name: string;
  dial: string; // without +
  min: number;
  max: number;
  flag: string;
}

export const countries: Country[] = [
  { code: "IN", name: "India", dial: "91", min: 10, max: 10, flag: "🇮🇳" },
  { code: "US", name: "United States", dial: "1", min: 10, max: 10, flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dial: "44", min: 10, max: 10, flag: "🇬🇧" },
  { code: "AE", name: "United Arab Emirates", dial: "971", min: 8, max: 9, flag: "🇦🇪" },
  { code: "CA", name: "Canada", dial: "1", min: 10, max: 10, flag: "🇨🇦" },
  { code: "AU", name: "Australia", dial: "61", min: 9, max: 9, flag: "🇦🇺" },
  { code: "SG", name: "Singapore", dial: "65", min: 8, max: 8, flag: "🇸🇬" },
  { code: "DE", name: "Germany", dial: "49", min: 10, max: 11, flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "33", min: 9, max: 9, flag: "🇫🇷" },
  { code: "ES", name: "Spain", dial: "34", min: 9, max: 9, flag: "🇪🇸" },
  { code: "IT", name: "Italy", dial: "39", min: 9, max: 10, flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", dial: "31", min: 9, max: 9, flag: "🇳🇱" },
  { code: "PK", name: "Pakistan", dial: "92", min: 10, max: 10, flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", dial: "880", min: 10, max: 10, flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", dial: "94", min: 9, max: 9, flag: "🇱🇰" },
  { code: "NP", name: "Nepal", dial: "977", min: 10, max: 10, flag: "🇳🇵" },
  { code: "SA", name: "Saudi Arabia", dial: "966", min: 9, max: 9, flag: "🇸🇦" },
  { code: "ZA", name: "South Africa", dial: "27", min: 9, max: 9, flag: "🇿🇦" },
  { code: "NG", name: "Nigeria", dial: "234", min: 10, max: 10, flag: "🇳🇬" },
  { code: "KE", name: "Kenya", dial: "254", min: 9, max: 9, flag: "🇰🇪" },
  { code: "BR", name: "Brazil", dial: "55", min: 10, max: 11, flag: "🇧🇷" },
  { code: "JP", name: "Japan", dial: "81", min: 10, max: 10, flag: "🇯🇵" },
  { code: "CN", name: "China", dial: "86", min: 11, max: 11, flag: "🇨🇳" },
  { code: "MY", name: "Malaysia", dial: "60", min: 9, max: 10, flag: "🇲🇾" },
];

export const defaultCountry = countries[0]; // India

export function validateNationalNumber(country: Country, digits: string) {
  const len = digits.length;
  if (len < country.min || len > country.max) {
    const need =
      country.min === country.max
        ? `${country.min} digits`
        : `${country.min}–${country.max} digits`;
    return `Enter a valid ${country.name} number (${need}).`;
  }
  return "";
}