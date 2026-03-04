import { useId } from "react";
import { CheckboxIndicator } from "../icons/CheckboxIndicator";
import { FormLabel } from "../FormLabel";

/**
 * Checkbox – Figma design system specs.
 * Layout: inline-flex, padding: var(--space-0), align-items: center, gap: var(--space-0)
 * Default: border color/border/core/default, fill color/fill/field/default-alt
 * Checked: border color/border/interactive/pressed, fill color/fill/field/default-alt, indicator color/icon/interactive/default
 */
export interface CheckboxProps {
  /** Checkbox label (e.g. "I agree to the Terms & Conditions"). When termsLinkHref is provided, label prefixes the link. */
  label: string;
  /** Checked state */
  checked: boolean;
  /** Called when checked state changes */
  onChange: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Helper/instruction text above the checkbox (supports required asterisk via required prop) */
  helperText?: string;
  /** When true, adds red asterisk to helperText */
  required?: boolean;
  /** Optional link URL (e.g. for terms). When provided with termsLinkText, label becomes "I agree to the [link]" */
  termsLinkHref?: string;
  /** Link text when termsLinkHref is provided (e.g. "Terms & Conditions") */
  termsLinkText?: string;
  /** Additional class for the wrapper */
  className?: string;
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  helperText,
  required = false,
  termsLinkHref,
  termsLinkText,
  className = "",
}: CheckboxProps) {
  const id = useId();
  const hasLink = termsLinkHref && termsLinkText;

  return (
    <div
      className={`flex flex-col items-start gap-[var(--space-200)] ${className}`}
    >
      {helperText && (
        <FormLabel required={required} as="p">
          {helperText}
        </FormLabel>
      )}
      <div
        className={`flex flex-wrap items-center gap-x-[var(--space-100)] gap-y-0 [font-feature-settings:'ss01'_on] ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <label htmlFor={id} className="flex cursor-pointer items-center gap-[var(--space-300)] shrink-0">
          <span
            className={`inline-flex shrink-0 cursor-pointer items-center justify-center self-center rounded-[var(--borderRadius-100)] border bg-[var(--color-fill-field-default-alt,#fff)] p-[var(--space-0)] focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-focus)] focus-within:ring-offset-1 ${
              disabled ? "cursor-not-allowed opacity-60" : ""
            }`}
            style={{
              width: 21,
              height: 21,
              gap: "var(--space-0, 0)",
              borderColor: checked
                ? "var(--color-border-interactive-pressed, #141414)"
                : "var(--color-border-core-default, #8a8a8a)",
              color: "var(--color-icon-interactive-default, #141414)",
            }}
          >
            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="sr-only"
              aria-label={hasLink ? `${label} ${termsLinkText}` : label}
              aria-required={required}
            />
            {checked && <CheckboxIndicator />}
          </span>
          <span className="body-100 text-[var(--color-text-core-default,#141414)] whitespace-nowrap">
            {label}
          </span>
        </label>
        {hasLink && (
          <button
            type="button"
            onClick={() => window.open(termsLinkHref, "_blank", "noopener,noreferrer")}
            className="link-100 hover:opacity-80 bg-transparent border-0 p-0 cursor-pointer text-left inline font-inherit"
          >
            {termsLinkText}
          </button>
        )}
      </div>
    </div>
  );
}
