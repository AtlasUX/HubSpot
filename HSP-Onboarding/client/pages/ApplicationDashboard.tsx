import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import SmartFill from "@/components/SmartFill";
import { InviteModal, ALL_SECTIONS } from "@/components/InviteModal";

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


export default function ApplicationDashboard() {
  const navigate = useNavigate();
  const state = useOnboarding();
  const { invites, addInvite, revokeInvite } = state;
  const countryInfo = COUNTRY_NAMES[state.country] ?? { label: state.country, flag: "🌐" };
  const [delegating, setDelegating] = useState<{ title: string; role?: string } | null>(null);
  const [showGlobalInvite, setShowGlobalInvite] = useState(false);

  const sections: Section[] = [
    {
      id: "identity",
      title: "Business identity",
      description: "Structure, legal name, industry, products, and registered address",
      path: state.selectedBusinessType ? "/business-information" : "/business-type",
      needs: ["Business type", "Legal business name", "Industry", "Products / services", "Registered address"],
      status: state.selectedBusinessType && state.legalBusinessName && state.industry && state.businessAddressStreet && state.businessAddressCity
        ? "complete"
        : state.selectedBusinessType || state.legalBusinessName || state.industry ? "in-progress"
        : "not-started",
      preview: state.legalBusinessName || undefined,
      required: true,
    },
    {
      id: "contact",
      title: "Contact & presence",
      description: "Website, business email, and customer support contact",
      path: "/business-details-op2",
      needs: ["Business website", "Business email & phone", "Support email & phone"],
      status: state.businessWebsite && state.contactEmail && state.supportEmail && state.supportPhone
        ? "complete"
        : state.businessWebsite || state.contactEmail ? "in-progress"
        : "not-started",
      preview: state.businessWebsite || undefined,
      required: true,
    },
    {
      id: "financials",
      title: "Tax & financials",
      description: "EIN, revenue volumes, and bank statement descriptor",
      path: "/business-financials",
      needs: ["EIN (IRS letter)", "Time in business", "Transaction volumes", "Bank statement descriptor"],
      status: state.ein && state.timeInBusiness && state.monthlyTransactionVolume && state.averageTransactionAmount && state.bankStatementDescription
        ? "complete"
        : state.ein || state.timeInBusiness || state.monthlyTransactionVolume ? "in-progress"
        : "not-started",
      preview: state.ein ? `EIN ···${state.ein.slice(-2)} verified` : undefined,
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
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowGlobalInvite(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-hs-text-subtle hover:border-[#4ABACD] hover:text-[#4ABACD] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                    <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M1 13c0-2.761 2.239-5 5-5M11 10v4M13 12h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Invite someone
                </button>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-hs-obsidian">{completedCount}<span className="text-hs-text-subtle font-normal text-base"> / {sections.length}</span></div>
                  <div className="text-xs text-hs-text-subtle">sections complete</div>
                </div>
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
                      title={`Invite someone to complete ${section.title}`}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M1 13c0-2.761 2.239-5 5-5M11 10v4M13 12h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Invite history */}
          {invites.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-hs-obsidian">Invites sent</h2>
              <div className="flex flex-col gap-2">
                {invites.map((inv) => {
                  const sectionLabels = inv.sections
                    .map((id) => ALL_SECTIONS.find((s) => s.id === id)?.title ?? id)
                    .join(", ");
                  const sentDate = new Date(inv.sentAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  return (
                    <div
                      key={inv.id}
                      className={`flex items-start justify-between gap-4 px-5 py-4 rounded-xl border bg-white ${
                        inv.status === "revoked" ? "opacity-50 border-gray-100" : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-hs-obsidian truncate">{inv.email}</span>
                          {inv.status === "revoked" && (
                            <span className="text-xs text-gray-400 flex-shrink-0">· Revoked</span>
                          )}
                        </div>
                        <span className="text-xs text-hs-text-subtle">{sectionLabels}</span>
                        <span className="text-xs text-gray-400">Sent {sentDate}</span>
                      </div>
                      {inv.status === "active" && (
                        <button
                          onClick={() => revokeInvite(inv.id)}
                          className="flex-shrink-0 text-xs text-gray-400 hover:text-red-500 transition-colors mt-0.5"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
        <InviteModal
          sectionTitle={delegating.title}
          onClose={() => setDelegating(null)}
          onSend={addInvite}
        />
      )}
      {showGlobalInvite && (
        <InviteModal
          sectionTitle="Business identity"
          onClose={() => setShowGlobalInvite(false)}
          onSend={addInvite}
        />
      )}
    </div>
  );
}
