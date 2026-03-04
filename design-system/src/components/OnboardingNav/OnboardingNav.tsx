import { ReactNode } from "react";

export type NavItem =
  | { type: "section-completed"; label: string; current?: boolean; path?: string }
  | { type: "section"; label: string; current?: boolean; path?: string }
  | { type: "substep"; label: string; current?: boolean; path?: string };

export interface OnboardingNavProps {
  items: NavItem[];
  /** Called when a nav item with a path is clicked */
  onItemClick?: (path: string) => void;
  className?: string;
}

/** Single nav item for gallery/documentation - use variant to show each state */
export interface OnboardingNavItemProps {
  variant: "section-completed" | "section" | "substep";
  label: string;
  active?: boolean;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.26 2.78503C12.45 2.58003 12.7651 2.57464 12.9651 2.75964H12.97C13.175 2.94463 13.1849 3.26471 12.9949 3.46472L5.49488 11.4647C5.39494 11.5697 5.26007 11.6248 5.13014 11.6249C5.0002 11.6249 4.87513 11.5797 4.77516 11.4799L1.27516 7.97985C1.08016 7.78485 1.08016 7.46977 1.27516 7.27477C1.47013 7.07993 1.78478 7.07991 1.97975 7.27477L5.115 10.41L12.26 2.78503Z" fill="#141414"/>
    </svg>
  );
}

function CompletedCircle() {
  return (
    <div className="relative w-[27px] h-[26px] shrink-0">
      <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 0.5C20.6977 0.5 26.5 6.11406 26.5 13C26.5 19.8859 20.6977 25.5 13.5 25.5C6.30234 25.5 0.5 19.8859 0.5 13C0.5 6.11406 6.30234 0.5 13.5 0.5Z" fill="white" stroke="#00A38D"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <CheckIcon />
      </div>
    </div>
  );
}

function SectionCircle() {
  return (
    <div className="w-[27px] h-[26px] shrink-0">
      <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 0.5C20.6977 0.5 26.5 6.11406 26.5 13C26.5 19.8859 20.6977 25.5 13.5 25.5C6.30234 25.5 0.5 19.8859 0.5 13C0.5 6.11406 6.30234 0.5 13.5 0.5Z" fill="white" stroke="#7C98B6"/>
      </svg>
    </div>
  );
}

/** Active section circle – white fill, orange border. Use when section is current and has no substeps. */
function SectionCircleActive() {
  return (
    <div className="w-[27px] h-[26px] shrink-0">
      <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 0.5C20.6977 0.5 26.5 6.11406 26.5 13C26.5 19.8859 20.6977 25.5 13.5 25.5C6.30234 25.5 0.5 19.8859 0.5 13C0.5 6.11406 6.30234 0.5 13.5 0.5Z" fill="white" stroke="#FF7A59"/>
      </svg>
    </div>
  );
}

function SubDot({ active = false }: { active?: boolean }) {
  return (
    <div className="w-[27px] flex justify-center shrink-0">
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4.5" cy="4.5" r="4" fill="white" stroke={active ? "#FF7A59" : "#7C98B6"}/>
      </svg>
    </div>
  );
}

export function OnboardingNavItem({
  variant,
  label,
  active = false,
}: OnboardingNavItemProps) {
  const iconWrapper = "w-[33px] flex justify-center shrink-0";
  const rowClasses = "flex items-center gap-[18px] py-[7px]";

  if (variant === "section-completed") {
    return (
      <div className={rowClasses}>
        <div className={iconWrapper}>
          <CompletedCircle />
        </div>
        <span
          className={`body-125 whitespace-nowrap ${active ? "text-hs-lorax" : "text-hs-obsidian"}`}
        >
          {label}
        </span>
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className={rowClasses}>
        <div className={iconWrapper}>
          {active ? <SectionCircleActive /> : <SectionCircle />}
        </div>
        <span className={`body-125 whitespace-nowrap ${active ? "text-hs-lorax" : "text-hs-obsidian"}`}>
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className={rowClasses}>
      <div className={iconWrapper}>
        <SubDot active={active} />
      </div>
      <span
        className={`body-100 whitespace-nowrap ${
          active ? "text-hs-lorax" : "text-hs-obsidian"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function NavRow({
  children,
  path,
  onItemClick,
  className = "",
}: {
  children: ReactNode;
  path?: string;
  onItemClick?: (path: string) => void;
  className?: string;
}) {
  const isClickable = path && onItemClick;
  if (isClickable) {
    return (
      <button
        type="button"
        onClick={() => onItemClick(path)}
        className={`flex w-full items-center gap-[18px] py-[7px] text-left hover:opacity-80 transition-opacity ${className}`}
      >
        {children}
      </button>
    );
  }
  return <div className={`flex items-center gap-[18px] py-[7px] ${className}`}>{children}</div>;
}

export function OnboardingNav({ items, onItemClick, className = "" }: OnboardingNavProps) {
  return (
    <nav className={`flex w-[300px] shrink-0 self-start pl-[20px] pr-16 pt-0 pb-2 ${className}`}>
      <div className="relative flex-1 min-w-0">
        <div className="absolute left-0 top-0 w-[33px] h-full rounded-[20px] bg-hs-great-white" />

        <div className="relative flex flex-col gap-0">
          {items.map((item, idx) => {
            const path = "path" in item ? item.path : undefined;
            if (item.type === "section-completed") {
              const isCurrent = "current" in item && item.current;
              return (
                <NavRow key={idx} path={path} onItemClick={onItemClick}>
                  <div className="w-[33px] flex justify-center shrink-0">
                    <CompletedCircle />
                  </div>
                  <span
                    className={`body-125 whitespace-nowrap ${isCurrent ? "text-hs-lorax" : "text-hs-obsidian"}`}
                  >
                    {item.label}
                  </span>
                </NavRow>
              );
            }
            if (item.type === "section") {
              const isCurrent = "current" in item && item.current;
              return (
                <NavRow key={idx} path={path} onItemClick={onItemClick}>
                  <div className="w-[33px] flex justify-center shrink-0">
                    {isCurrent ? <SectionCircleActive /> : <SectionCircle />}
                  </div>
                  <span
                    className={`body-125 whitespace-nowrap ${isCurrent ? "text-hs-lorax" : "text-hs-obsidian"}`}
                  >
                    {item.label}
                  </span>
                </NavRow>
              );
            }
            return (
              <NavRow key={idx} path={path} onItemClick={onItemClick}>
                <div className="w-[33px] flex justify-center shrink-0">
                  <SubDot active={item.current} />
                </div>
                <span
                  className={`body-100 whitespace-nowrap ${
                    item.current
                      ? "text-hs-lorax"
                      : "text-hs-obsidian"
                  }`}
                >
                  {item.label}
                </span>
              </NavRow>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
