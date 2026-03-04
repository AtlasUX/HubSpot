/**
 * Chevron up icon – 14×14, points up.
 */
export function ChevronUp({ className = "" }: { className?: string }) {
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
        d="M6.77516 4.27514C6.97016 4.08017 7.28476 4.08015 7.47975 4.27514L11.9797 8.77514C12.1747 8.97014 12.1747 9.28521 11.9797 9.48021C11.8798 9.58007 11.7547 9.62475 11.6248 9.62475C11.4948 9.6247 11.3697 9.57515 11.2698 9.48021L7.12477 5.33519L2.97975 9.48021C2.78481 9.67492 2.4701 9.67491 2.27516 9.48021C2.08016 9.28521 2.08016 8.97014 2.27516 8.77514L6.77516 4.27514Z"
        fill="currentColor"
      />
    </svg>
  );
}
