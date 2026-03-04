import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold min-h-[40px] rounded-[var(--borderRadius-100)] transition-colors cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 active:scale-[0.98]";
    const variants = {
      primary:
        "bg-[var(--color-fill-primary-default)] text-white hover:bg-hs-obsidian/90 border border-[var(--color-border-primary-default)] px-6 py-0 disabled:bg-[var(--color-fill-primary-disabled)] disabled:text-[var(--color-text-primary-disabled)] disabled:border-[var(--color-border-primary-disabled)] disabled:hover:bg-[var(--color-fill-primary-disabled)] disabled:active:scale-100",
      secondary:
        "bg-[var(--color-fill-secondary-default)] text-hs-obsidian border border-[var(--color-border-secondary-default)] hover:bg-hs-great-white disabled:opacity-50 disabled:active:scale-100",
      ghost: "bg-transparent text-hs-obsidian hover:bg-hs-great-white disabled:opacity-50 disabled:active:scale-100",
    };
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
