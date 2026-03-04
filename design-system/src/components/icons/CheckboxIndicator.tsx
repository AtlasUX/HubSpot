/**
 * Checkbox indicator – 15×15 checkmark icon.
 * Used inside checked checkbox. Color: var(--color-icon-interactive-default)
 */
export function CheckboxIndicator({ className = "" }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M2 7.5L6 11.5L13 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
