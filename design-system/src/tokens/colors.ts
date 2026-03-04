/**
 * Design System Color Tokens
 * Source of truth for the Payments Acquisition app
 */
export const colors = {
  obsidian: "#141414",
  "great-white": "#F5F5F5",
  lorax: "#FF7A59",
  /** Primary Calypso - border, selected radio fill */
  "calypso-medium": "#7FD1DE",
  /** Selected radio card background */
  "calypso-selected-bg": "#E8F4F7",
  pantera: "#141414",
  "text-subtle": "#6B7280",
  "caution-border": "#F59E0B",
  "caution-fill": "#FFFBEB",
  "radio-border": "#7C98B6",
  /** Radio checkbox checked - border and indicator */
  "radio-checked": "#4ABACD",
  /** Radio checkbox unchecked disabled - background */
  "radio-disabled-bg": "#EAF0F6",
  /** Radio checkbox unchecked disabled - border */
  "radio-disabled-border": "#CBD6E2",
  /** Form field focus state - outline/ring color */
  focus: "#00A4BD",
  /** Specialty link on fill alt - underlined link color */
  "link-on-fill-alt": "#006162",
  /** Positive/success - fill subtle */
  "fill-positive-subtle": "#EDF4EF",
  /** Positive/success - border default */
  "border-positive-default": "#00823A",
  /** Error/alert - text and border (color/text/alert/default) */
  "text-alert-default": "#D9002B",
  /** Error/alert - border (same as text-alert-default) */
  "border-alert-default": "#D9002B",
  /** Fill - primary disabled state (e.g. read-only message backgrounds) */
  "fill-primary-disabled": "#F5F5F5",
} as const;

export type ColorToken = keyof typeof colors;
