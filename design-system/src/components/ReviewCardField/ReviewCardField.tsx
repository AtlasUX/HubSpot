/**
 * Read-only field for review cards.
 * Label uses body/125, value uses body/100.
 */
export interface ReviewCardFieldProps {
  /** Field label (e.g. "Email") */
  label: string;
  /** Read-only value */
  value: string;
  /** When true, preserves newlines in value (e.g. for addresses) */
  multiline?: boolean;
}

export function ReviewCardField({ label, value, multiline = false }: ReviewCardFieldProps) {
  return (
    <div className="flex w-[365px] flex-col items-start gap-[var(--space-0)]">
      <label
        className="[font-feature-settings:'ss01'_on]"
        style={{
          color: "var(--color-text-core-default, #141414)",
          fontFamily: "var(--typography-body-125-fontFamily, 'Lexend Deca')",
          fontSize: "var(--typography-body-125-fontSize, 14px)",
          fontWeight: "var(--typography-body-125-fontWeight, 600)",
          lineHeight: "var(--typography-body-125-lineHeight, 24px)",
          letterSpacing: "var(--typography-body-125-letterSpacing, 0)",
        }}
      >
        {label}
      </label>
      <span
        className="[font-feature-settings:'ss01'_on]"
        style={{
          color: "var(--color-text-core-default, #141414)",
          fontFamily: "var(--typography-body-100-fontFamily, 'Lexend Deca')",
          fontSize: "var(--typography-body-100-fontSize, 14px)",
          fontWeight: "var(--typography-body-100-fontWeight, 300)",
          lineHeight: "var(--typography-body-100-lineHeight, 24px)",
          letterSpacing: "var(--typography-body-100-letterSpacing, 0)",
          whiteSpace: multiline ? "pre-line" : undefined,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}
