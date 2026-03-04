import { useId } from "react";

/**
 * Info icon – 12×12, lowercase 'i' in a circle.
 * Use for tooltips and contextual help.
 */
export function InfoIcon({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "-");
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g clipPath={`url(#${id}_clip0)`}>
        <mask id={`${id}_mask0`} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x={0} y={0} width={12} height={12}>
          <g clipPath={`url(#${id}_clip1)`}>
            <g clipPath={`url(#${id}_clip2)`}>
              <path d="M6.10742 4.82159C6.34314 4.82159 6.53599 5.01444 6.53599 5.25016V8.67873H7.82171C8.05742 8.67873 8.25028 8.87159 8.25028 9.1073C8.25028 9.34301 8.05742 9.53587 7.82171 9.53587H4.39314C4.15742 9.53587 3.96456 9.34301 3.96456 9.1073C3.96456 8.87159 4.15742 8.67873 4.39314 8.67873H5.67885V5.67873H4.82171C4.58599 5.67873 4.39314 5.48587 4.39314 5.25016C4.39314 5.01444 4.58599 4.82159 4.82171 4.82159H6.10742Z" fill="currentColor" />
              <path d="M6.10742 2.67873C6.46314 2.67873 6.75028 2.96587 6.75028 3.32159C6.75028 3.6773 6.46314 3.96444 6.10742 3.96444C5.75171 3.96444 5.46456 3.6773 5.46456 3.32159C5.46456 2.96587 5.75171 2.67873 6.10742 2.67873Z" fill="currentColor" />
              <path fillRule="evenodd" clipRule="evenodd" d="M6.10742 0.1073C9.41599 0.1073 12.1074 2.79873 12.1074 6.1073C12.1074 9.41587 9.41599 12.1073 6.10742 12.1073C2.79885 12.1073 0.107422 9.41587 0.107422 6.1073C0.107422 2.79873 2.79885 0.1073 6.10742 0.1073ZM6.10742 0.964443C3.27028 0.964443 0.964565 3.27016 0.964565 6.1073C0.964565 8.94444 3.27028 11.2502 6.10742 11.2502C8.94456 11.2502 11.2503 8.94444 11.2503 6.1073C11.2503 3.27016 8.94456 0.964443 6.10742 0.964443Z" fill="currentColor" />
            </g>
          </g>
        </mask>
        <g mask={`url(#${id}_mask0)`}>
          <path d="M0 0H12V12H0V0Z" fill="currentColor" />
        </g>
      </g>
      <defs>
        <clipPath id={`${id}_clip0`}>
          <rect width="12" height="12" fill="white" />
        </clipPath>
        <clipPath id={`${id}_clip1`}>
          <rect width="12" height="12" fill="white" />
        </clipPath>
        <clipPath id={`${id}_clip2`}>
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
