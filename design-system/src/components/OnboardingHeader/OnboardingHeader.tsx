import { HubspotLogo } from "../icons";

export interface OnboardingHeaderProps {
  onExit?: () => void;
  className?: string;
}

/**
 * Onboarding header – logo left, Exit link right.
 * Background: Primary-Obsidian (#33475B)
 */
export function OnboardingHeader({
  onExit,
  className = "",
}: OnboardingHeaderProps) {
  return (
    <header
      className={`flex w-full h-[62px] shrink-0 items-center justify-between bg-[var(--Primary-Obsidian)] px-[var(--space-400)] ${className}`}
    >
      <HubspotLogo />
      <button
        type="button"
        onClick={onExit}
        className="text-link-underline hover:opacity-90 transition-opacity"
      >
        Exit
      </button>
    </header>
  );
}
