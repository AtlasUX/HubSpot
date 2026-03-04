import { ReactNode } from "react";

/**
 * Radio card - a selectable card used as a radio button option.
 * Selected state: light teal background, calypso border, filled radio.
 * Default state: white background, calypso border, empty radio.
 */
export interface RadioCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onChange?: () => void;
  className?: string;
}

function RadioButton({
  checked = false,
  disabled = false,
}: {
  checked?: boolean;
  disabled?: boolean;
}) {
  const getStyles = () => {
    if (disabled)
      return {
        outer: "bg-[#EAF0F6] border-[#CBD6E2]",
        indicator: null,
      };
    if (checked)
      return {
        outer: "bg-white border-[#4ABACD]",
        indicator: "#4ABACD",
      };
    return {
      outer: "bg-white border-[#7C98B6]",
      indicator: null,
    };
  };
  const styles = getStyles();

  return (
    <div className="flex items-start">
      <div className="w-[21px] h-[21px] flex justify-center items-center relative">
        <div
          className={`w-[21px] h-[21px] rounded-full border absolute left-0 top-0 ${styles.outer}`}
        />
        {styles.indicator && (
          <div
            className="w-[9px] h-[9px] rounded-full absolute left-[6px] top-[6px]"
            style={{ backgroundColor: styles.indicator }}
          />
        )}
      </div>
    </div>
  );
}

export function RadioCard({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onChange,
  className = "",
}: RadioCardProps) {
  return (
    <div
      onClick={disabled ? undefined : onChange}
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      className={`flex w-full h-[115px] py-4 px-6 items-center gap-6 rounded-[3px] transition-colors border border-[#7FD1DE] ${
        disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none bg-white"
          : selected
            ? "bg-[#E8F4F7] cursor-pointer"
            : "bg-white cursor-pointer"
      } ${className}`}
    >
      <div className="flex-shrink-0">
        <RadioButton checked={selected} disabled={disabled} />
      </div>

      <div className="flex flex-col items-start gap-1 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-hs-pantera">{icon}</div>
          <div className="text-hs-obsidian text-sm font-semibold leading-[17px]">
            {title}
          </div>
        </div>
        <div className="text-hs-text-subtle text-sm font-light leading-6 flex-1 max-w-md">
          {description}
        </div>
      </div>
    </div>
  );
}
