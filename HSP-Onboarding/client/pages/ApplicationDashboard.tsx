import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import SmartFill from "@/components/SmartFill";

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
  inviteRole?: string;
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

function DelegateModal({ sectionTitle, role, onClose }: { sectionTitle: string; role?: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-hs-obsidian">Invite someone to complete this</h2>
          <p className="text-sm text-hs-text-subtle mt-0.5">
            They'll get a secure link to fill out <span className="font-medium text-hs-obsidian">{sectionTitle}</span> on your behalf.
            {role && <span className="text-hs-text-subtle"> Typically completed by: {role}.</span>}
          </p>
        </div>

        {sent ? (
          <div className="px-6 py-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f0fafb] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4ABACD" />
                <path d="M7 12l3.5 3.5L17 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-hs-obsidian">Link sent to {email}</p>
            <p className="text-xs text-hs-text-subtle">They'll receive a secure, one-time link. You'll be notified when they complete it.</p>
            <button onClick={onClose} className="mt-2 text-sm text-[#4ABACD] hover:underline">Done</button>
          </div>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Their email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Add a note <span className="font-normal text-hs-text-subtle">(optional)</span></label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`e.g. Can you fill out the ${sectionTitle} section?`}
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-hs-obsidian placeholder-gray-300 resize-none focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-hs-text-subtle hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => email.trim() && setSent(true)}
                disabled={!email.trim()}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  email.trim()
                    ? "bg-[#141414] text-white hover:bg-[#2d2d2d]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Send invite →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplicationDashboard() {
  const navigate = useNavigate();
  const state = useOnboarding();
  const countryInfo = COUNTRY_NAMES[state.country] ?? { label: state.country, flag: "🌐" };

  const [delegating, setDelegating] = useState<{ title: string; role?: string } | null>(null);

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
      needs: ["Monthly revenue range", "Average transaction amount"],
      status: state.timeInBusiness && state.monthlyTransactionVolume && state.averageTransactionAmount
        ? "complete"
        : state.timeInBusiness || state.monthlyTransactionVolume ? "in-progress"
        : "not-started",
      preview: state.monthlyTransactionVolume ? `${state.monthlyTransactionVolume} / month` : undefined,
      required: true,
      inviteRole: "accountant or bookkeeper",
    },
    {
      id: "representative",
      title: "Business representative",
      description: "The person legally responsible for this account",
      path: "/business-representative",
      needs: ["Full name & date of birth", "Home address", "SSN"],
      status: state.repFirstName && state.repLastName && state.repSsnLast4
        ? "complete"
        : state.repFirstName || state.repLastName ? "in-progress"
        : "not-started",
      preview: state.repFirstName ? `${state.repFirstName} ${state.repLastName}` : undefined,
      required: true,
      inviteRole: "business owner or officer",
    },
    {
      id: "ownership",
      title: "Ownership",
      description: "Anyone who owns 25% or more of the business",
      path: "/owners",
      needs: ["Full name & date of birth", "Home address", "SSN"],
      status: state.ownerFirstName && state.ownerLastName && state.ownerSsnLast4
        ? "complete"
        : state.ownerFirstName || state.ownerLastName ? "in-progress"
        : "not-started",
      preview: state.ownerFirstName ? `${state.ownerFirstName} ${state.ownerLastName}` : undefined,
      required: true,
      inviteRole: "business owner",
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

          {/* Smart fill */}
          <SmartFill />

          {/* Section cards */}
          <div className="flex flex-col gap-3">
            {sections.map((section) => {
              const isComplete = section.status === "complete";
              const isInProgress = section.status === "in-progress";

              return (
                <div
                  key={section.id}
                  className={`group flex items-start gap-5 w-full px-6 py-5 rounded-xl border bg-white transition-all duration-150 ${
                    isComplete
                      ? "border-[#4ABACD]/30 hover:border-[#4ABACD] hover:shadow-sm"
                      : isInProgress
                        ? "border-[#4ABACD]/50 hover:border-[#4ABACD] hover:shadow-sm"
                        : "border-gray-200 hover:border-[#4ABACD] hover:shadow-sm"
                  }`}
                >
                  <div className="mt-0.5 cursor-pointer" onClick={() => navigate(section.path)}>
                    <StatusDot status={section.status} />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1 min-w-0 cursor-pointer" onClick={() => navigate(section.path)}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-hs-obsidian">{section.title}</span>
                      <span className={`text-sm flex-shrink-0 transition-colors ${
                        isComplete ? "text-[#4ABACD]" : isInProgress ? "text-[#4ABACD]" : "text-gray-400 group-hover:text-[#4ABACD]"}`}>
                        {isComplete ? "Edit →" : isInProgress ? "Continue →" : "Start →"}
                      </span>
                    </div>

                    <span className="text-sm text-hs-text-subtle">{section.description}</span>

                    {isComplete && section.preview && (
                      <span className="text-sm text-[#4ABACD] font-medium mt-0.5">
                        ✓ {section.preview}
                      </span>
                    )}

                    {isInProgress && section.preview && (
                      <span className="text-sm text-amber-600 font-medium mt-0.5">
                        ⟳ {section.preview} · incomplete
                      </span>
                    )}

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

                  {section.inviteRole && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDelegating({ title: section.title, role: section.inviteRole }); }}
                      className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg text-gray-300 hover:text-[#4ABACD] hover:bg-[#f0fafb] transition-colors"
                      title={`Send to ${section.inviteRole}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={() => navigate("/review-and-finish")}
              disabled={!allComplete}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                allComplete
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

      {delegating && (
        <DelegateModal
          sectionTitle={delegating.title}
          role={delegating.role}
          onClose={() => setDelegating(null)}
        />
      )}
    </div>
  );
}
