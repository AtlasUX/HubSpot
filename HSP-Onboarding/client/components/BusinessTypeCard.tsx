import { ReactNode } from "react";

interface BusinessTypeCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onChange?: () => void;
}

function RadioButton({
  checked = false,
  disabled = false,
  disabledSelected = false,
}: {
  checked?: boolean;
  disabled?: boolean;
  /** When true, show selected styling even though disabled (locked state) */
  disabledSelected?: boolean;
}) {
  const getStyles = () => {
    if (disabledSelected && checked)
      return {
        outer: "bg-white border-[#4ABACD]",
        indicator: "#4ABACD",
      };
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

export default function BusinessTypeCard({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onChange,
}: BusinessTypeCardProps) {
  const isDisabledSelected = disabled && selected;

  return (
    <div
      onClick={disabled ? undefined : onChange}
      className={`flex w-full h-[115px] py-4 px-6 items-center gap-6 rounded-[4px] transition-colors border ${
        disabled
          ? isDisabledSelected
            ? "cursor-not-allowed pointer-events-none bg-[#E8F4F7] border-[#7FD1DE]"
            : "opacity-50 cursor-not-allowed pointer-events-none bg-[#EAF0F6] border-[#CBD6E2]"
          : selected
            ? "bg-[#E8F4F7] cursor-pointer border-[#7FD1DE]"
            : "bg-white cursor-pointer border-[#7FD1DE]"
      }`}
    >
      <div className="flex-shrink-0">
        <RadioButton checked={selected} disabled={disabled} disabledSelected={isDisabledSelected} />
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

export function IndividualIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11.0071 11.6497C12.2214 11.6497 13.3286 12.3288 13.8929 13.4145C14.0784 13.7644 13.9427 14.1928 13.5929 14.3785C13.4858 14.4356 13.3714 14.4573 13.2644 14.4573V14.4643C13.0072 14.4643 12.7568 14.3214 12.6282 14.0785C12.3068 13.4644 11.6856 13.086 11.0071 13.0859C10.3285 13.0859 9.70675 13.4643 9.38532 14.0785C9.20673 14.4285 8.77129 14.5642 8.42132 14.3785C8.07136 14.1999 7.93575 13.7645 8.12137 13.4145C8.68566 12.3288 9.79283 11.6497 11.0071 11.6497Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M11.0071 5.17858C12.3857 5.17858 13.5071 6.3 13.5071 7.67858C13.5071 9.05715 12.3857 10.1786 11.0071 10.1786C9.62854 10.1786 8.50712 9.05715 8.50712 7.67858C8.50712 6.3 9.62854 5.17858 11.0071 5.17858ZM11.0071 6.60715C10.4143 6.60715 9.93569 7.08572 9.93569 7.67858C9.93569 8.27143 10.4143 8.75001 11.0071 8.75001C11.6 8.75001 12.0785 8.27143 12.0785 7.67858C12.0785 7.08572 11.6 6.60715 11.0071 6.60715Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.8927 1.60715C17.0713 1.60715 18.0356 2.57143 18.0356 3.75V16.6071C18.0356 17.7857 17.0713 18.75 15.8927 18.75H5.89272C4.71415 18.75 3.74986 17.7857 3.74986 16.6071V14.4643H3.03557C2.64272 14.4643 2.32129 14.1429 2.32129 13.75C2.32129 13.3571 2.64272 13.0357 3.03557 13.0357H3.74986V10.8929H3.03557C2.64272 10.8929 2.32129 10.5714 2.32129 10.1786C2.32129 9.78572 2.64272 9.46429 3.03557 9.46429H3.74986V7.32143H3.03557C2.64272 7.32143 2.32129 7 2.32129 6.60715C2.32129 6.21429 2.64272 5.89286 3.03557 5.89286H3.74986V3.75C3.74986 2.57143 4.71415 1.60715 5.89272 1.60715H15.8927ZM5.89272 3.03572C5.49986 3.03572 5.17843 3.35715 5.17843 3.75V5.89286H5.89272C6.28558 5.89286 6.607 6.21429 6.607 6.60715C6.607 7 6.28558 7.32143 5.89272 7.32143H5.17843V9.46429H5.89272C6.28558 9.46429 6.607 9.78572 6.607 10.1786C6.607 10.5714 6.28558 10.8929 5.89272 10.8929H5.17843V13.0357H5.89272C6.28558 13.0357 6.607 13.3571 6.607 13.75C6.607 14.1429 6.28558 14.4643 5.89272 14.4643H5.17843V16.6071C5.17843 17 5.49986 17.3214 5.89272 17.3214H15.8927C16.2856 17.3214 16.607 17 16.607 16.6071V3.75C16.607 3.35715 16.2856 3.03572 15.8927 3.03572H5.89272Z" fill="currentColor"/>
    </svg>
  );
}

export function NonprofitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#clip0)">
        <path d="M5.53585 1.60712C8.493 1.60712 10.893 4.00712 10.893 6.96426C10.893 7.35712 10.5716 7.67855 10.1787 7.67855C9.78585 7.67855 9.46443 7.35712 9.46443 6.96426C9.46443 4.79997 7.70014 3.03569 5.53585 3.03569C3.37157 3.03569 1.60728 4.79997 1.60728 6.96426C1.60728 11.907 8.54991 16.2567 10.1787 17.214C11.8075 16.2567 18.7501 11.907 18.7501 6.96426C18.7501 4.79997 16.9859 3.03569 14.8216 3.03569C14.0788 3.03569 13.3503 3.24267 12.7289 3.64255C12.3933 3.8568 11.9576 3.75702 11.7433 3.42143C11.5362 3.08573 11.6288 2.6501 11.9644 2.4358C12.8216 1.90009 13.8073 1.61409 14.8216 1.61409C17.7787 1.61409 20.1786 4.01417 20.1787 6.97124C20.1787 13.3927 10.9142 18.4569 10.5142 18.6712C10.4071 18.7283 10.293 18.7569 10.1787 18.7569V18.75C10.0645 18.75 9.94317 18.7213 9.84319 18.6642C9.45034 18.4499 0.178711 13.3857 0.178711 6.96426C0.178711 4.00712 2.57871 1.60712 5.53585 1.60712Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

export function CompanyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M9.49268 3.03571C9.88552 3.03572 10.207 3.35714 10.207 3.74999V16.6071C10.207 17 9.88552 17.3214 9.49268 17.3214C9.09982 17.3214 8.77839 17 8.77839 16.6071V4.46428H3.03551V16.6071C3.03551 17 2.71408 17.3214 2.32122 17.3214C1.92836 17.3214 1.60693 17 1.60693 16.6071V3.74999C1.60693 3.35713 1.92836 3.03571 2.32122 3.03571H9.49268Z" fill="currentColor"/>
      <path d="M13.8356 7.43582C14.0784 7.27874 14.3852 7.27879 14.628 7.43582L18.4352 9.97837C18.6352 10.1141 18.7567 10.3356 18.7568 10.5713V16.6002C18.7567 16.9929 18.4353 17.3144 18.0425 17.3144L18.0355 17.3214C17.6426 17.3214 17.3212 17 17.3212 16.6071V10.957L14.2283 8.89299L12.7209 9.90024C12.3924 10.1214 11.9497 10.0285 11.7283 9.70005C11.5069 9.37148 11.5999 8.92887 11.9285 8.70744L13.8356 7.43582Z" fill="currentColor"/>
      <path d="M6.60693 11.6071C6.99979 11.6071 7.32122 11.9286 7.32122 12.3214C7.32122 12.7143 6.99979 13.0357 6.60693 13.0357H5.17836C4.78551 13.0357 4.46408 12.7143 4.46408 12.3214C4.46408 11.9286 4.78551 11.6071 5.17836 11.6071H6.60693Z" fill="currentColor"/>
      <path d="M6.60693 8.74999C6.99979 8.74999 7.32122 9.07142 7.32122 9.46428C7.32122 9.85713 6.99979 10.1786 6.60693 10.1786H5.17836C4.78551 10.1786 4.46408 9.85713 4.46408 9.46428C4.46408 9.07142 4.78551 8.74999 5.17836 8.74999H6.60693Z" fill="currentColor"/>
      <path d="M6.60693 5.89285C6.99979 5.89285 7.32122 6.21428 7.32122 6.60713C7.32122 6.99999 6.99979 7.32142 6.60693 7.32142H5.17836C4.78551 7.32142 4.46408 6.99999 4.46408 6.60713C4.46408 6.21428 4.78551 5.89285 5.17836 5.89285H6.60693Z" fill="currentColor"/>
    </svg>
  );
}
