import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon or content to display */
  children: ReactNode;
  /** Accessible label (required for icon-only buttons) */
  "aria-label": string;
}

/**
 * Icon button – 40×40, circular, transparent background.
 * Use for close buttons, toolbar actions, etc.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`flex w-10 h-10 justify-center items-center rounded-[30px] bg-[var(--color-fill-inverse-default-transparent)] hover:bg-black/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
