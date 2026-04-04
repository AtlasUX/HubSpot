import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader, Div } from "design-system/components";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";
import { InviteModal } from "@/components/InviteModal";
import { useOnboarding } from "@/contexts/OnboardingContext";

export default function Owners() {
  const navigate = useNavigate();
  const { addInvite } = useOnboarding();
  const [showInvite, setShowInvite] = useState(false);

  const handleBack = () => {
    navigate("/business-representative");
  };

  const handleNext = () => {
    navigate("/review-and-finish");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />
      <div className="flex items-center justify-end px-8 pt-4">
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-hs-text-subtle hover:border-[#4ABACD] hover:text-[#4ABACD] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1 13c0-2.761 2.239-5 5-5M11 10v4M13 12h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Invite collaborator
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex min-h-full">
          <div className="flex flex-1 min-h-0 pl-0 py-[var(--space-800)] pr-[20px]">
            <WizardSidebar currentStep="owners" />

            <div className="flex-1 flex flex-col min-h-0 pl-[20px] pb-[var(--space-1400)]">
              <div className="flex flex-col items-start gap-[var(--space-800)] max-w-2xl">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h1 className="heading-400">
                    Owner(s)
                  </h1>
                  <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on]">
                    Add the owners of your business. We require at least one owner for company applications.
                  </p>
                  <Div />
                </div>

                <p className="body-100 text-hs-text-subtle [font-feature-settings:'ss01'_on]">
                  Form fields coming soon.
                </p>
              </div>
            </div>
          </div>

          <div
            className="w-[330px] shrink-0 self-stretch"
            style={{ backgroundColor: "var(--Accent-Gypsum, #f5f8fa)" }}
          />
        </div>
      </div>

      <WizardFooter onBack={handleBack} onNext={handleNext} />
      {showInvite && (
        <InviteModal
          sectionTitle="Ownership"
          onClose={() => setShowInvite(false)}
          onSend={addInvite}
        />
      )}
    </div>
  );
}
