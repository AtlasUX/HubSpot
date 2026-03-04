import { InfoIcon } from "../icons/InfoIcon";

export interface OnboardingTooltipProps {
  /** Bold title text (body/125, font-weight 600) */
  title: string;
  /** Description text (body/100, font-weight 300) */
  description: string;
  className?: string;
}

/**
 * OnboardingTooltip – info icon, title, and description.
 * Display in the right column when the related form field has focus.
 * Only one tooltip should be visible at a time (only the focused field's tooltip).
 */
export function OnboardingTooltip({ title, description, className = "" }: OnboardingTooltipProps) {
  return (
    <div
      className={`flex flex-col justify-center items-start gap-[var(--space-200,8px)] ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-[var(--color-text-core-default,#141414)]">
          <InfoIcon />
        </span>
        <span className="body-125 text-[var(--color-text-core-default,#141414)] [font-feature-settings:'ss01'_on]">
          {title}
        </span>
      </div>
      <div className="body-100 text-[var(--color-text-core-default,#141414)] [font-feature-settings:'ss01'_on] pl-5 flex flex-col gap-[var(--space-200)]">
        {description.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
