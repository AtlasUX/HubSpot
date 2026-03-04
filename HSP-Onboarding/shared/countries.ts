import type { SelectOption } from "design-system/components";

import countryData from "country-list/data.json";

type CountryEntry = { code: string; name: string };

/** All countries as SelectOptions with countryCode for flag display. Sorted by name. */
export const COUNTRY_OPTIONS: SelectOption[] = (countryData as CountryEntry[])
  .map((c) => ({
    value: c.code,
    label: c.name.replace(/\s*\(the\)\s*/gi, " ").trim(),
    countryCode: c.code,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
