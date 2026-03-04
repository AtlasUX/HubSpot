/**
 * Chevron left icon – 14×14, points left.
 * Use as lead icon for Back buttons.
 */
export function ChevronLeft({ className = "" }: { className?: string }) {
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
        d="M9.27027 2.2752C9.46527 2.08023 9.77987 2.08021 9.97486 2.2752C10.1699 2.4702 10.1699 2.78528 9.97486 2.98028L5.82984 7.12481L9.97486 11.2698C10.1699 11.4648 10.1699 11.7799 9.97486 11.9749C9.87487 12.0749 9.74987 12.1199 9.61988 12.1199L9.62525 12.1248C9.49536 12.1248 9.37023 12.0751 9.27027 11.9803L4.77027 7.48028C4.57527 7.28528 4.57527 6.9702 4.77027 6.7752L9.27027 2.2752Z"
        fill="currentColor"
      />
    </svg>
  );
}
