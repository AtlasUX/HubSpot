import { useState, useId } from "react";
import { FormLabel } from "../FormLabel";

export interface TextFieldProps {
  /** Label text (supports required asterisk via required prop) */
  label?: string;
  /** Placeholder when empty */
  placeholder?: string;
  /** Input value */
  value?: string;
  /** Called when value changes */
  onChange?: (value: string) => void;
  /** Helper text below the field */
  helperText?: string;
  /** Error message (shows below field, applies error border) */
  error?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required (adds asterisk to label) */
  required?: boolean;
  /** Input type (text, email, etc.) */
  type?: "text" | "email" | "tel";
  /** Minimum length for validation */
  minLength?: number;
  /** Full width */
  fullWidth?: boolean;
  /** Called when field receives focus */
  onFocus?: () => void;
  /** Called when field loses focus */
  onBlur?: () => void;
  /** Additional class for the input element */
  inputClassName?: string;
  className?: string;
}

const fieldBase =
  "flex py-[var(--space-200)] px-[var(--space-300)] w-full rounded-[var(--borderRadius-100)] min-h-[40px]";
const fieldDefault =
  "border border-[var(--color-border-field-default)] bg-[var(--color-fill-field-default)]";
const fieldActive =
  "border border-[var(--color-focus)] bg-[var(--color-fill-field-default)]";
const fieldDisabled =
  "border border-[var(--color-border-tertiary-disabled)] bg-[var(--color-fill-field-default)]";
const fieldError =
  "border border-[var(--color-border-alert-default,#D9002B)] bg-[var(--color-fill-field-default)]";
const valueTypography =
  "body-100 text-[var(--color-text-core-default)] [font-feature-settings:'ss01'_on]";

export function TextField({
  label,
  placeholder = "",
  value = "",
  onChange,
  helperText,
  error,
  disabled = false,
  required = false,
  type = "text",
  minLength,
  fullWidth = true,
  onFocus,
  onBlur,
  inputClassName = "",
  className = "",
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();
  const errorId = useId();
  const fieldState = disabled
    ? fieldDisabled
    : error
      ? fieldError
      : focused
        ? fieldActive
        : fieldDefault;

  return (
    <div
      className={`flex flex-col items-start gap-[var(--space-100)] ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {label && (
        <FormLabel htmlFor={inputId} required={required} fullWidth={fullWidth}>
          {label}
        </FormLabel>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        placeholder={placeholder}
        disabled={disabled}
        minLength={minLength}
        className={`${fieldBase} ${fieldState} ${valueTypography} placeholder:text-hs-text-subtle focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-1 transition-[border-color,box-shadow] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60 ${inputClassName}`}
        aria-label={label}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p
          id={errorId}
          className="body-100"
          style={{ color: "var(--color-text-alert-default, #D9002B)" }}
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="body-100 text-hs-text-subtle">{helperText}</p>
      )}
    </div>
  );
}
