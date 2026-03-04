/**
 * Chevron down icon – 14×14, points down.
 */
export function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M11.2649 4.77516C11.4599 4.58016 11.775 4.58016 11.97 4.77516C12.1649 4.97016 12.165 5.28525 11.97 5.48023L7.46998 9.98023C7.37125 10.0789 7.24807 10.1232 7.11988 10.1243C6.99185 10.123 6.86891 10.0738 6.77027 9.98023L2.27027 5.48023C2.07527 5.28523 2.07527 4.97016 2.27027 4.77516C2.46527 4.58019 2.77987 4.58017 2.97486 4.77516L7.11988 8.92018L11.2649 4.77516Z"
        fill="currentColor"
      />
    </svg>
  );
}
