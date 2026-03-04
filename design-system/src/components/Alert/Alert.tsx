import { ReactNode } from "react";

/**
 * Alert is a banner used within the context of the current page to
 * communicate a general message to the user.
 */
export type AlertType = "warning" | "info" | "success" | "error";
export type AlertUse = "inline";
export type AlertContentLayout = "single-line" | "multi-line";

export interface AlertProps {
  /** Alert variant - affects colors and icon */
  type?: AlertType;
  /** Display context (inline by default) */
  use?: AlertUse;
  /** How content wraps */
  contentLayout?: AlertContentLayout;
  /** Whether to show a title */
  title?: boolean;
  /** Title text when title is shown */
  titleText?: string;
  /** Main body text */
  text?: string;
  /** Whether the alert can be dismissed */
  closeable?: boolean;
  /** Called when close is clicked */
  onClose?: () => void;
  /** Whether to show an action button */
  action?: boolean;
  /** Action button label */
  actionLabel?: string;
  /** Called when action is clicked */
  onAction?: () => void;
  /** Custom content (alternative to text) */
  children?: ReactNode;
  className?: string;
}

const typeStyles: Record<
  AlertType,
  { border: string; bg: string; title: string; text: string }
> = {
  warning: {
    border: "border-hs-caution-border",
    bg: "bg-hs-caution-fill",
    title: "text-hs-obsidian",
    text: "text-hs-obsidian",
  },
  info: {
    border: "border-hs-calypso-medium",
    bg: "bg-hs-great-white",
    title: "text-hs-obsidian",
    text: "text-hs-obsidian",
  },
  success: {
    border: "border-[var(--color-border-positive-default,#00823A)]",
    bg: "bg-[var(--color-fill-positive-subtle,#EDF4EF)]",
    title: "text-hs-obsidian",
    text: "text-hs-obsidian",
  },
  error: {
    border: "border-hs-border-alert-default",
    bg: "bg-red-50",
    title: "text-hs-obsidian",
    text: "text-hs-obsidian",
  },
};

export function Alert({
  type = "warning",
  use: _use = "inline",
  contentLayout = "multi-line",
  title = true,
  titleText,
  text,
  closeable = false,
  onClose,
  action = false,
  actionLabel,
  onAction,
  children,
  className = "",
}: AlertProps) {
  const styles = typeStyles[type];
  const content = children ?? text;

  return (
    <div
      className={`w-full rounded-sm border p-5 flex flex-col items-start gap-0 ${styles.border} ${styles.bg} ${className}`}
      role="alert"
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col justify-center items-start gap-2 flex-1">
          {title && titleText && (
            <h3
              className={`text-base font-semibold leading-5 ${styles.title}`}
            >
              {titleText}
            </h3>
          )}
          {content && (
            <div
              className={`flex flex-col justify-center items-start gap-2 w-full ${
                contentLayout === "single-line" ? "truncate" : ""
              }`}
            >
              {typeof content === "string" ? (
                <p className={`text-sm font-light leading-6 ${styles.text}`}>
                  {content}
                </p>
              ) : (
                content
              )}
            </div>
          )}
        </div>
        {closeable && (
          <button
            onClick={onClose}
            className="shrink-0 ml-2 p-1 rounded hover:bg-black/5 text-hs-text-subtle"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
      {action && actionLabel && (
        <button
          onClick={onAction}
          className="mt-3 text-sm font-medium text-hs-text-alert-default hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
