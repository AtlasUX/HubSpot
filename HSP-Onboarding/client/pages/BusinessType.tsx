import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding, type BusinessStructureOption } from "@/contexts/OnboardingContext";
import PhaseProgress from "@/components/PhaseProgress";

const BUSINESS_TYPES = [
  {
    value: "individual" as const,
    label: "Just me",
    sub: "Sole proprietor, freelancer, or independent contractor",
    emoji: "👤",
  },
  {
    value: "company" as const,
    label: "Registered business",
    sub: "LLC, corporation, or partnership",
    emoji: "🏢",
  },
  {
    value: "nonprofit" as const,
    label: "Nonprofit",
    sub: "Registered charity, foundation, or religious organization",
    emoji: "💙",
  },
];

const STRUCTURES: {
  value: BusinessStructureOption;
  label: string;
  sub: string;
  taxNote?: string;
  taxNoteWarning?: boolean;
}[] = [
  {
    value: "sole-proprietorship",
    label: "Sole proprietorship",
    sub: "Unregistered individual business — no separate legal entity",
    taxNote: "Your 1099K and taxes report under your personal SSN, not a business tax ID",
    taxNoteWarning: true,
  },
  {
    value: "single-member-llc",
    label: "Single-member LLC",
    sub: "One owner, registered as an LLC",
    taxNote: "Your 1099K and taxes report under your personal SSN, not a business tax ID",
    taxNoteWarning: true,
  },
  {
    value: "multi-member-llc",
    label: "Multi-member LLC",
    sub: "Multiple owners, registered as an LLC",
    taxNote: "Tax reporting uses your business EIN",
  },
  {
    value: "private-partnership",
    label: "Private partnership",
    sub: "Two or more partners sharing ownership",
    taxNote: "Tax reporting uses your business EIN",
  },
  {
    value: "private-corporation",
    label: "Private corporation",
    sub: "C-Corp, S-Corp, or private corporation",
    taxNote: "Tax reporting uses your business EIN",
  },
];

export default function BusinessType() {
  const navigate = useNavigate();
  const {
    selectedBusinessType,
    setSelectedBusinessType,
    businessStructure,
    setBusinessStructure,
    setHasConfirmedBusinessType,
  } = useOnboarding();

  const [pendingType, setPendingType] = useState(selectedBusinessType);

  const handleTypeSelect = (value: typeof BUSINESS_TYPES[number]["value"]) => {
    setPendingType(value);
    setSelectedBusinessType(value);
    if (value !== "company") {
      setBusinessStructure(null);
      setHasConfirmedBusinessType(true);
      navigate("/business-information");
    }
  };

  const handleStructureSelect = (value: BusinessStructureOption) => {
    setBusinessStructure(value);
    setHasConfirmedBusinessType(true);
    navigate("/business-information");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />
      <PhaseProgress />

      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto">
        <div className="flex flex-col items-center gap-10 w-full max-w-lg py-10">

          <div className="flex flex-col items-center gap-3 text-center w-full">
            <h1 className="text-[32px] font-semibold text-hs-obsidian leading-tight">
              How is your business set up?
            </h1>
            <p className="text-base text-hs-text-subtle">
              This determines your tax reporting and required documents.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {BUSINESS_TYPES.map(({ value, label, sub, emoji }) => {
              const isSelected = pendingType === value;
              return (
                <div key={value}>
                  <button
                    onClick={() => handleTypeSelect(value)}
                    className={`group flex items-center gap-5 w-full px-6 py-5 rounded-xl border-2 text-left transition-all duration-150
                      ${isSelected
                        ? "border-[#4ABACD] bg-[#f0fafb]"
                        : "border-gray-200 bg-white hover:border-[#4ABACD] hover:bg-[#f0fafb] hover:shadow-sm"
                      } active:scale-[0.99]`}
                  >
                    <span className="text-3xl w-10 text-center flex-shrink-0">{emoji}</span>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <span className="text-base font-semibold text-hs-obsidian">{label}</span>
                      <span className="text-sm text-hs-text-subtle">{sub}</span>
                    </div>
                    <span className={`text-xl transition-all duration-200 ml-auto
                      ${isSelected && value === "company" ? "rotate-90 text-[#4ABACD]" : "text-gray-300 group-hover:text-[#4ABACD]"}`}>
                      →
                    </span>
                  </button>

                  {value === "company" && isSelected && (
                    <div className="mt-2 ml-6 flex flex-col gap-2">
                      <p className="text-xs font-medium text-hs-text-subtle uppercase tracking-wide px-1 pt-1">
                        What's your structure?
                      </p>
                      {STRUCTURES.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => handleStructureSelect(s.value)}
                          className={`group flex items-center gap-4 w-full px-5 py-4 rounded-lg border-2 text-left transition-all duration-150
                            ${businessStructure === s.value
                              ? "border-[#4ABACD] bg-[#f0fafb]"
                              : "border-gray-200 bg-white hover:border-[#4ABACD] hover:bg-[#f0fafb]"
                            }`}
                        >
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-sm font-semibold text-hs-obsidian">{s.label}</span>
                            <span className="text-xs text-hs-text-subtle">{s.sub}</span>
                            {s.taxNote && (
                              <span className={`text-xs mt-0.5 ${s.taxNoteWarning ? "text-amber-600" : "text-[#4ABACD]"}`}>
                                {s.taxNoteWarning ? "⚠ " : "✓ "}{s.taxNote}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-300 group-hover:text-[#4ABACD] text-lg transition-colors ml-auto flex-shrink-0">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-hs-text-subtle text-center">
            Not sure what applies to you?{" "}
            <a href="#" className="text-[#0091AE] underline hover:text-[#007a94]">
              Check your registration documents
            </a>{" "}
            or talk to your accountant.
          </p>

        </div>
      </div>
    </div>
  );
}
