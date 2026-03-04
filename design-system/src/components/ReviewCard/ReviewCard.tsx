import { type ReactNode } from "react";
import { IconButton } from "../IconButton";
import { EditIcon } from "../icons/EditIcon";

/**
 * Review card – section with label, card container, and optional edit icon at top right.
 * Use for displaying read-only information in review flows.
 */
export interface ReviewCardProps {
  /** Section label above the card (e.g. "GENERAL INFORMATION") */
  label: string;
  /** Card content (fields, etc.) */
  children: ReactNode;
  /** When provided, shows edit icon at top right. Click handler can be no-op for now. */
  onEditClick?: () => void;
  /** Card background - "default" (white) or "muted" (fill-primary-disabled gray) */
  variant?: "default" | "muted";
}

export function ReviewCard({
  label,
  children,
  onEditClick,
  variant = "default",
}: ReviewCardProps) {
  return (
    <div className="flex w-[491px] flex-col items-start gap-[var(--space-200)]">
      <h2
        className="uppercase [font-feature-settings:'ss01'_on]"
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
      </h2>
      <div
        className="flex flex-col items-stretch self-stretch rounded-[var(--borderRadius-100)] p-[var(--space-600)]"
        style={{
          border: "1px solid var(--Accent-Great-White, #DFE3EB)",
          background:
            variant === "muted"
              ? "var(--color-fill-primary-disabled, #F5F5F5)"
              : "#FFF",
        }}
      >
        <div
          className="flex w-full flex-col items-stretch self-stretch"
          style={{ gap: "var(--space-600)" }}
        >
          {onEditClick !== undefined ? (
            <div className="flex w-full min-w-0 items-start justify-between gap-[var(--space-400)]">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[var(--space-600)]">
                {children}
              </div>
              <IconButton
                onClick={onEditClick}
                aria-label="Edit"
                className="ml-auto shrink-0 text-[#0091AE] hover:opacity-80"
              >
                <EditIcon />
              </IconButton>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
