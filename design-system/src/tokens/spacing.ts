/**
 * Design System Spacing Tokens
 */
export const spacing = {
  "space-400": "16px",
  "space-600": "24px",
} as const;

export type SpacingToken = keyof typeof spacing;
