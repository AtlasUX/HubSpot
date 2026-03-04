import { useId } from "react";

/**
 * Edit icon – 14×14, pencil shape.
 * Use for edit actions on review/read-only cards.
 * Color: #0091AE (teal)
 */
export function EditIcon({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const clipId = `edit-clip-${id}`;

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
      <g clipPath={`url(#${clipId})`}>
        <mask
          id={`${clipId}-mask`}
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="14"
          height="14"
        >
          <g clipPath={`url(#${clipId}-1)`}>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.48696 1.09018C9.87457 1.09019 10.2429 1.24518 10.5142 1.51651L12.3019 3.31408C12.8639 3.88097 12.8639 4.80169 12.3019 5.36858L5.0827 12.5882C4.99068 12.6802 4.86945 12.7282 4.7387 12.7283L4.7335 12.7335H1.57461C1.30817 12.7335 1.09016 12.5154 1.09009 12.2489V9.08959C1.09012 8.95881 1.14343 8.83763 1.23062 8.7456L8.45971 1.51651C8.73589 1.24034 9.09935 1.09018 9.48696 1.09018ZM2.05441 9.28832V11.7644H4.53524L10.2209 6.07834L7.74239 3.59987L2.05441 9.28832ZM9.48223 2.06396C9.35147 2.06396 9.23028 2.11252 9.13824 2.20449L8.42564 2.91662L10.9041 5.39508L11.6139 4.68533C11.8028 4.49636 11.8028 4.19103 11.6139 4.00207L9.82623 2.20449C9.7342 2.11247 9.613 2.064 9.48223 2.06396Z"
              fill="#141414"
            />
          </g>
        </mask>
        <g mask={`url(#${clipId}-mask)`}>
          <path d="M0 0H13.5667V13.5667H0V0Z" fill="#0091AE" />
        </g>
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="13.5667" height="13.5667" fill="white" />
        </clipPath>
        <clipPath id={`${clipId}-1`}>
          <rect width="13.5667" height="13.5667" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
