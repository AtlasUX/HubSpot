/**
 * Chevron right icon – 14×14, points right.
 * Use as trail icon for Continue/Next buttons.
 */
export function ChevronRight({ className = "" }: { className?: string }) {
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
        d="M4.77027 2.2752C4.96527 2.08023 5.27987 2.08021 5.47486 2.2752L9.97486 6.7752C10.1699 6.9702 10.1699 7.28528 9.97486 7.48028L5.47486 11.9803C5.37549 12.0795 5.25141 12.1238 5.12232 12.1243C4.99341 12.1236 4.86953 12.0745 4.77027 11.9803C4.57527 11.7853 4.57527 11.4702 4.77027 11.2752L8.9148 7.13018L4.77027 2.98028C4.57527 2.78528 4.57527 2.4702 4.77027 2.2752Z"
        fill="currentColor"
      />
    </svg>
  );
}
