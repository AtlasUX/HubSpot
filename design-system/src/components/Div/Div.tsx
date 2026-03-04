/**
 * Div - horizontal line using #dfe3eb.
 */
export interface DivProps {
  className?: string;
}

export function Div({ className = "" }: DivProps) {
  return (
    <div
      role="separator"
      className={`w-full h-px bg-hs-great-white ${className}`}
      aria-hidden
    />
  );
}
