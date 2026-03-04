import { useNavigate } from "react-router-dom";
import { OnboardingHeader, Div } from "design-system/components";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";

export default function BusinessRepresentative() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/business-financials");
  };

  const handleNext = () => {
    navigate("/owners");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex min-h-full">
          <div className="flex flex-1 min-h-0 pl-0 py-[var(--space-800)] pr-[20px]">
            <WizardSidebar currentStep="business-representative" />

            <div className="flex-1 flex flex-col min-h-0 pl-[20px] pb-[var(--space-1400)]">
              <div className="flex flex-col items-start gap-[var(--space-800)] max-w-2xl">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h1 className="heading-400">
                    Business representative
                  </h1>
                  <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on]">
                    Provide the primary contact who will represent your business for this application.
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
    </div>
  );
}
