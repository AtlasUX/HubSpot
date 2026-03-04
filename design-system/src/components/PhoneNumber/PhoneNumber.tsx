import { useState, useRef, useEffect } from "react";
import { PHONE_COUNTRY_CODES } from "../../data/phoneCountryCodes";
import { FormLabel } from "../FormLabel";

/** Converts ISO 3166-1 alpha-2 country code to flag emoji */
function countryCodeToFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  const chars = code
    .toUpperCase()
    .split("")
    .map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...chars);
}

export interface PhoneNumberProps {
  /** Label text (supports required asterisk via required prop) */
  label?: string;
  /** Selected country code (e.g. "US") */
  countryCode?: string;
  /** Phone number without country code */
  value?: string;
  /** Placeholder for phone input */
  placeholder?: string;
  /** Called when country or number changes: (countryCode, phoneNumber) */
  onChange?: (countryCode: string, phoneNumber: string) => void;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required (adds asterisk to label) */
  required?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Called when field receives focus */
  onFocus?: () => void;
  /** Called when field loses focus */
  onBlur?: () => void;
  className?: string;
}

const containerBase =
  "flex items-stretch rounded-[var(--borderRadius-100)] min-h-[40px] overflow-hidden";
const fieldDefault =
  "border border-[var(--color-border-field-default)] bg-[var(--color-fill-field-default)]";
const fieldActive =
  "border border-[var(--color-focus)] bg-[var(--color-fill-field-default)]";
const fieldDisabled =
  "border border-[var(--color-border-tertiary-disabled)] bg-[var(--color-fill-field-default)]";
const valueTypography =
  "body-100 text-[var(--color-text-core-default)] [font-feature-settings:'ss01'_on]";

export function PhoneNumber({
  label,
  countryCode = "US",
  value = "",
  placeholder = "(222) 232-3345",
  onChange,
  disabled = false,
  required = false,
  fullWidth = true,
  onFocus,
  onBlur,
  className = "",
}: PhoneNumberProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = PHONE_COUNTRY_CODES.find((c) => c.code === countryCode) ?? PHONE_COUNTRY_CODES[0];
  const isActive = open || focused;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fieldState = disabled ? fieldDisabled : isActive ? fieldActive : fieldDefault;

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        setFocused(false);
        onBlur?.();
      }
    }, 0);
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-start gap-[var(--space-100)] ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {label && (
        <FormLabel required={required} fullWidth={fullWidth}>
          {label}
        </FormLabel>
      )}
      <div
        className={`${containerBase} ${fieldState} ${fullWidth ? "w-full" : ""} focus-within:ring-2 focus-within:ring-[var(--color-focus)] focus-within:ring-offset-1 focus-within:border-[var(--color-focus)] transition-[border-color,box-shadow] duration-150 ease-out`}
      >
        {/* Country selector - flag + dial code + dropdown */}
        <button
          type="button"
          onClick={() => !disabled && setOpen((o) => !o)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="flex items-center gap-2 py-[var(--space-200)] pl-[var(--space-300)] pr-2 shrink-0 border-r border-[var(--color-border-field-default)] cursor-pointer disabled:cursor-not-allowed focus:outline-none"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="shrink-0 text-lg leading-none">
            {countryCodeToFlag(selected.countryCode)}
          </span>
          <span className={`${valueTypography} shrink-0`}>{selected.dialCode}</span>
          <span className="shrink-0 text-[var(--color-text-core-default)]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M3 3l3 3 3-3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {/* Phone number input */}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange?.(countryCode, e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 min-w-0 py-[var(--space-200)] px-[var(--space-300)] ${valueTypography} placeholder:text-hs-text-subtle bg-transparent border-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60`}
          aria-label={`${label} number`}
        />
      </div>

      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-[var(--borderRadius-100)] border border-[var(--color-border-field-default)] bg-[var(--color-fill-field-default)] py-1 shadow-lg"
          role="listbox"
        >
          {PHONE_COUNTRY_CODES.map((opt) => (
            <button
              key={opt.code}
              type="button"
              role="option"
              aria-selected={opt.code === countryCode}
              onClick={() => {
                onChange?.(opt.code, value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-[var(--space-300)] py-[var(--space-200)] text-left ${valueTypography} hover:bg-hs-great-white focus:bg-hs-great-white focus:outline-none`}
            >
              <span className="shrink-0 text-lg leading-none">
                {countryCodeToFlag(opt.countryCode)}
              </span>
              <span className="truncate">{opt.dialCode} {opt.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
