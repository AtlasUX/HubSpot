import { type ReactNode } from "react";

const labelStyles =
  "body-125 text-[var(--color-text-core-default,#141414)] overflow-hidden text-ellipsis [font-feature-settings:'ss01'_on]";

/**
 * Form label – consistent label styling for form inputs.
 * Uses body-125 typography. Required asterisk uses --color-text-required-default (orange).
 */
export interface FormLabelProps {
  /** Label content (text or ReactNode) */
  children: ReactNode;
  /** Render as label (default) or p (e.g. for helper text above checkbox) */
  as?: "label" | "p";
  /** Associated form control id (for htmlFor, only when as="label") */
  htmlFor?: string;
  /** When true, appends required asterisk using default required color */
  required?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Additional class */
  className?: string;
}

export function FormLabel({
  children,
  as = "label",
  htmlFor,
  required = false,
  fullWidth = false,
  className = "",
}: FormLabelProps) {
  const classes = `${labelStyles} ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {children}
      {required && (
        <span
          className="form-label-required-asterisk"
          aria-hidden
        >
          {" "}
          *
        </span>
      )}
    </>
  );

  if (as === "p") {
    return <p className={classes}>{content}</p>;
  }

  return (
    <label htmlFor={htmlFor} className={classes}>
      {content}
    </label>
  );
}
