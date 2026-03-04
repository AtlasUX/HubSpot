import { useEffect } from "react";
import { CloseIcon } from "../icons";

export type ToastVariant = "success";

const variantStyles: Record<
  ToastVariant,
  { border: string; bg: string }
> = {
  success: {
    border: "border-[var(--color-border-positive-default,#00823A)]",
    bg: "bg-[var(--color-fill-positive-subtle,#EDF4EF)]",
  },
};

export interface ToastProps {
  /** Toast variant - affects colors */
  variant?: ToastVariant;
  /** Message to display */
  message: string;
  /** Called when toast is closed (dismiss or close button) */
  onClose: () => void;
  /** Auto-dismiss after this many milliseconds (default: 5000) */
  autoDismissMs?: number;
  className?: string;
}

/**
 * Toast – transient notification with close button.
 * Use for success, info, or error feedback. Auto-dismisses after a delay.
 */
export function Toast({
  variant = "success",
  message,
  onClose,
  autoDismissMs = 5000,
  className = "",
}: ToastProps) {
  const styles = variantStyles[variant];

  useEffect(() => {
    if (autoDismissMs <= 0) return;
    const timer = setTimeout(onClose, autoDismissMs);
    return () => clearTimeout(timer);
  }, [autoDismissMs, onClose]);

  return (
    <div
      role="alert"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-[var(--space-400)] px-[var(--space-600)] py-[var(--space-400)] rounded-[var(--borderRadius-transitional-component,4px)] border ${styles.border} ${styles.bg} shadow-lg max-w-[90vw] ${className}`}
    >
      <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on] flex-1">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 p-1 rounded hover:bg-black/5 text-hs-obsidian"
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
