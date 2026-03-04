import { useState, useRef, useEffect, useMemo } from "react";
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

export interface SelectOption {
  value: string;
  label: string;
  /** ISO 3166-1 alpha-2 country code for flag (e.g. "US"). Omit for non-country dropdowns. */
  countryCode?: string;
}

export interface SelectProps {
  /** Label text (supports required asterisk via required prop) */
  label?: string;
  /** Placeholder when no value selected */
  placeholder?: string;
  /** Selected value */
  value?: string;
  /** Options to display */
  options: SelectOption[];
  /** Called when selection changes */
  onChange?: (value: string) => void;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required (adds asterisk to label) */
  required?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Enable type-ahead search to filter options by label */
  searchable?: boolean;
  /** Called when field receives focus (including when dropdown opens) */
  onFocus?: () => void;
  /** Called when field loses focus (including when dropdown closes) */
  onBlur?: () => void;
  className?: string;
}

const fieldBase =
  "flex py-[var(--space-200)] px-[var(--space-300)] justify-between items-center self-stretch rounded-[var(--borderRadius-100)] min-h-[40px] overflow-hidden";
const fieldDefault =
  "border border-[var(--color-border-field-default)] bg-[var(--color-fill-field-default)]";
const fieldActive =
  "border border-[var(--color-focus)] bg-[var(--color-fill-field-default)]";
const fieldDisabled =
  "border border-[var(--color-border-tertiary-disabled)] bg-[var(--color-fill-primary-disabled)] cursor-not-allowed";
const valueTypography =
  "body-100 text-[var(--color-text-core-default)] overflow-hidden text-ellipsis [font-feature-settings:'ss01'_on]";

export function Select({
  label,
  placeholder = "Select",
  value = "",
  options,
  onChange,
  disabled = false,
  required = false,
  fullWidth = true,
  searchable = false,
  onFocus,
  onBlur,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const showFlags = options.some((o) => o.countryCode);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(q)
    );
  }, [options, searchQuery, searchable]);

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

  useEffect(() => {
    if (open && searchable) {
      setSearchQuery("");
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open, searchable]);

  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (!prevOpenRef.current && open) {
      onFocus?.();
    }
    if (prevOpenRef.current && !open) {
      onBlur?.();
    }
    prevOpenRef.current = open;
  }, [open, onFocus, onBlur]);

  const handleSelect = (opt: SelectOption) => {
    onChange?.(opt.value);
    setOpen(false);
  };

  const fieldState = disabled ? fieldDisabled : isActive ? fieldActive : fieldDefault;

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
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        onFocus={() => {
          setFocused(true);
          if (!open) onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          if (!open) onBlur?.();
        }}
        disabled={disabled}
        className={`${fieldBase} ${fieldState} ${fullWidth ? "w-full" : ""} cursor-pointer disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-1 transition-[border-color,box-shadow,outline] duration-150 ease-out`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        <span className={`flex items-center gap-2 min-w-0 flex-1 justify-start ${valueTypography} ${disabled ? "text-[var(--color-text-primary-disabled)]" : ""}`}>
          {showFlags && selectedOption?.countryCode && (
            <span className="shrink-0 text-lg leading-none">
              {countryCodeToFlag(selectedOption.countryCode)}
            </span>
          )}
          <span className={`truncate ${!value && !disabled ? "text-hs-text-subtle" : ""}`}>
            {displayLabel}
          </span>
        </span>
        <span className={`shrink-0 ml-2 ${disabled ? "text-[var(--color-text-primary-disabled)] opacity-60" : "text-[var(--color-text-core-default)]"}`}>
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
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 flex flex-col rounded-[var(--borderRadius-100)] border border-[var(--color-border-field-default)] bg-[var(--color-fill-field-default)] shadow-lg overflow-hidden"
          role="listbox"
        >
          {searchable && (
            <div className="p-2 border-b border-[var(--color-border-field-default)] shrink-0">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search..."
                className="w-full py-[var(--space-200)] px-[var(--space-300)] rounded-[var(--borderRadius-100)] border border-[var(--color-border-field-default)] bg-[var(--color-fill-field-default)] body-100 text-[var(--color-text-core-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:border-[var(--color-focus)] transition-[border-color,box-shadow] duration-150 ease-out"
                aria-label="Search options"
              />
            </div>
          )}
          <div className="max-h-60 overflow-auto py-1">
          {filteredOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt)}
              className={`flex w-full items-center gap-2 px-[var(--space-300)] py-[var(--space-200)] text-left ${valueTypography} hover:bg-hs-great-white focus:bg-hs-great-white focus:outline-none`}
            >
              {showFlags && opt.countryCode && (
                <span className="shrink-0 text-lg leading-none">
                  {countryCodeToFlag(opt.countryCode)}
                </span>
              )}
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
