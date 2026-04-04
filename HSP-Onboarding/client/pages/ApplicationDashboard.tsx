import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";

const COUNTRY_NAMES: Record<string, { label: string; flag: string }> = {
  US: { label: "United States", flag: "🇺🇸" },
  GB: { label: "United Kingdom", flag: "🇬🇧" },
  CA: { label: "Canada", flag: "🇨🇦" },
};

type SectionStatus = "complete" | "in-progress" | "not-started";

interface Section {
  id: string;
  title: string;
  description: string;
  path: string;
  needs: string[];
  status: SectionStatus;
  preview?: string;
  required: boolean;
}

function StatusDot({ status }: { status: SectionStatus }) {
  if (status === "complete") {
    return (
      <div className="w-7 h-7 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (status === "in-progress") {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-[#4ABACD] bg-[#e8f4f7] flex items-center justify-center flex-shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-[#4ABACD]" />
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-gray-200 bg-white flex-shrink-0" />
  );
}

export default function ApplicationDashboard() {
  const navigate = useNavigate();
  const state = useOnboarding();
  const countryInfo = COUNTRY_NAMES[state.country] ?? { label: state.country, flag: "🌐" };

  const sections: Section[] = [
    {
      id: "structure",
      title: "Business structure",
      description: "How your business is legally set up",
      path: "/business-type",
      needs: ["Business type (LLC, Corp, sole prop…)"],
      status: state.selectedBusinessType
        ? (state.selectedBusinessType !== "company" || state.businessStructure ? "complete" : "in-progress")
        : "not-started",
      preview: state.selectedBusinessType
        ? [
            state.selectedBusinessType === "individual" ? "Sole / Individual" :
            state.selectedBusinessType === "nonprofit" ? "Nonprofit" : null,
            state.businessStructure
              ? state.businessStructure.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              : null,
          ].filter(Boolean).join(" · ")
        : undefined,
      required: true,
    },
    {
      id: "details",
      title: "Business details",
      description: "Legal name, industry, and what you sell",
      path: "/business-information",
      needs: ["Legal business name", "Industry category", "Products or services description"],
      status: state.legalBusinessName && state.industry ? "complete" : state.legalBusinessName || state.industry ? "in-progress" : "not-started",
      preview: state.legalBusinessName || undefined,
      required: true,
    },
    {
      id: "address",
      title: "Address & contact",
      description: "Where you operate and how customers reach you",
      path: "/business-details-op2",
      needs: ["Business address", "Support email", "Support phone number"],
      status: state.businessAddressStreet && state.businessAddressCity && state.supportEmail
        ? "complete"
        : state.businessAddressStreet || state.supportEmail ? "in-progress"
        : "not-started",
      preview: state.businessAddressCity
        ? `${state.businessAddressCity}${state.businessAddressState ? ", " + state.businessAddressState : ""}`
        : undefined,
      required: true,
    },
    {
      id: "financials",
      title: "Financials",
      description: "Revenue, transaction volumes, and tax ID",
      path: "/business-financials",
      needs: ["EIN (Employer Identification Number)", "Monthly revenue range", "Average transaction amount"],
      status: state.timeInBusiness && state.monthlyTransactionVolume && state.ein
        ? "complete"
        : state.timeInBusiness || state.monthlyTransactionVolume ? "in-progress"
        : "not-started",
      preview: state.monthlyTransactionVolume ? `${state.monthlyTransactionVolume} / month` : undefined,
      required: true,
    },
    {
      id: "representative",
      title: "Business representative",
      description: "The person legally responsible for this account",
      path: "/business-representative",
      needs: ["Full name & date of birth", "Home address", "Last 4 digits of SSN"],
      status: state.repFirstName && state.repLastName && state.repSsnLast4
        ? "complete"
        : state.repFirstName || state.repLastName ? "in-progress"
        : "not-started",
      preview: state.repFirstName ? `${state.repFirstName} ${state.repLastName}` : undefined,
      required: true,
    },
    {
      id: "ownership",
      title: "Ownership",
      description: "Anyone who owns 25% or more of the business",
      path: "/owners",
      needs: ["Full name & date of birth", "Home address", "Last 4 digits of SSN"],
      status: state.ownerFirstName && state.ownerLastName && state.ownerSsnLast4
        ? "complete"
        : state.ownerFirstName || state.ownerLastName ? "in-progress"
        : "not-started",
      preview: state.ownerFirstName ? `${state.ownerFirstName} ${state.ownerLastName}` : undefined,
      required: true,
    },
  ];

  const completedCount = sections.filter((s) => s.status === "complete").length;
  const allComplete = completedCount === sections.length;
  const progressPct = Math.round((completedCount / sections.length) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fafb]">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />

      <div className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-8">

          {/* Application header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-hs-text-subtle">
                  <span>{countryInfo.flag}</span>
                  <span>{countryInfo.label}</span>
                  <span className="text-gray-300">·</span>
                  <button
                    onClick={() => navigate("/general-information")}
                    className="text-[#0091AE] hover:underline"
                  >
                    Change
                  </button>
                </div>
                <h1 className="text-2xl font-semibold text-hs-obsidian">
                  HubSpot Payments Application
                </h1>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-semibold text-hs-obsidian">{completedCount}<span className="text-hs-text-subtle font-normal text-base"> / {sections.length}</span></div>
                <div className="text-xs text-hs-text-subtle">sections complete</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4ABACD] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Section cards */}
          <div className="flex flex-col gap-3">
            {sections.map((section) => {
              const isComplete = section.status === "complete";
              const isInProgress = section.status === "in-progress";

              return (
                <button
                  key={section.id}
                  onClick={() => navigate(section.path)}
                  className={`group flex items-start gap-5 w-full px-6 py-5 rounded-xl border text-left transition-all duration-150 bg-white
                    ${isComplete
                      ? "border-[#4ABACD]/30 hover:border-[#4ABACD] hover:shadow-sm"
                      : isInProgress
                        ? "border-[#4ABACD]/50 hover:border-[#4ABACD] hover:shadow-sm"
                        : "border-gray-200 hover:border-[#4ABACD] hover:shadow-sm"
                    }`}
                >
                  <div className="mt-0.5">
                    <StatusDot status={section.status} />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-hs-obsidian">{section.title}</span>
                      <span className={`text-sm flex-shrink-0 transition-colors
                        ${isComplete ? "text-[#4ABACD]" : isInProgress ? "text-[#4ABACD]" : "text-gray-400 group-hover:text-[#4ABACD]"}`}>
                        {isComplete ? "Edit →" : isInProgress ? "Continue →" : "Start →"}
                      </span>
                    </div>

                    <span className="text-sm text-hs-text-subtle">{section.description}</span>

                    {/* Completed: show captured data */}
                    {isComplete && section.preview && (
                      <span className="text-sm text-[#4ABACD] font-medium mt-0.5">
                        ✓ {section.preview}
                      </span>
                    )}

                    {/* In progress: show partial data */}
                    {isInProgress && section.preview && (
                      <span className="text-sm text-amber-600 font-medium mt-0.5">
                        ⟳ {section.preview} · incomplete
                      </span>
                    )}

                    {/* Not started: show what they'll need */}
                    {section.status === "not-started" && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {section.needs.map((need) => (
                          <span
                            key={need}
                            className="text-xs bg-gray-100 text-hs-text-subtle px-2 py-0.5 rounded-full"
                          >
                            {need}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={() => navigate("/review-and-finish")}
              disabled={!allComplete}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200
                ${allComplete
                  ? "bg-[#141414] text-white hover:bg-[#2d2d2d] hover:shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              {allComplete ? "Review & submit application →" : `Complete all sections to submit`}
            </button>
            {!allComplete && (
              <p className="text-xs text-hs-text-subtle text-center">
                {sections.length - completedCount} section{sections.length - completedCount !== 1 ? "s" : ""} remaining
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
