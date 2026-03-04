/** Country code + dial code for phone number selector */
export interface PhoneCountryCode {
  code: string;
  dialCode: string;
  countryCode: string;
}

/** Common country codes with dial codes for phone input */
export const PHONE_COUNTRY_CODES: PhoneCountryCode[] = [
  { code: "US", dialCode: "+1", countryCode: "US" },
  { code: "CA", dialCode: "+1", countryCode: "CA" },
  { code: "GB", dialCode: "+44", countryCode: "GB" },
  { code: "AU", dialCode: "+61", countryCode: "AU" },
  { code: "DE", dialCode: "+49", countryCode: "DE" },
  { code: "FR", dialCode: "+33", countryCode: "FR" },
  { code: "IN", dialCode: "+91", countryCode: "IN" },
  { code: "JP", dialCode: "+81", countryCode: "JP" },
  { code: "MX", dialCode: "+52", countryCode: "MX" },
  { code: "BR", dialCode: "+55", countryCode: "BR" },
  { code: "CN", dialCode: "+86", countryCode: "CN" },
  { code: "ES", dialCode: "+34", countryCode: "ES" },
  { code: "IT", dialCode: "+39", countryCode: "IT" },
  { code: "NL", dialCode: "+31", countryCode: "NL" },
  { code: "IE", dialCode: "+353", countryCode: "IE" },
  { code: "NZ", dialCode: "+64", countryCode: "NZ" },
  { code: "SG", dialCode: "+65", countryCode: "SG" },
  { code: "KR", dialCode: "+82", countryCode: "KR" },
  { code: "ZA", dialCode: "+27", countryCode: "ZA" },
  { code: "AF", dialCode: "+93", countryCode: "AF" },
];
