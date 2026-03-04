import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OnboardingHeader, Select, Div, Toast } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { COUNTRY_OPTIONS } from "@shared/countries";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";

export default function GeneralInformation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { country, setCountry } = useOnboarding();
  const [showRestartToast, setShowRestartToast] = useState(false);

  useEffect(() => {
    const restartSuccess = (location.state as { restartSuccess?: boolean })?.restartSuccess;
    if (restartSuccess) {
      setShowRestartToast(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const handleBack = () => {
    console.log("Back clicked");
    // TODO: Navigate to Processor Selection
  };

  const handleNext = () => {
    if (country) {
      navigate("/business-type", { replace: false });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {showRestartToast && (
        <Toast
          variant="success"
          message="Your HubSpot payments application has been successfully reset"
          onClose={() => setShowRestartToast(false)}
          autoDismissMs={5000}
        />
      )}
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex min-h-full">
          <div className="flex flex-1 min-h-0 pl-0 py-[var(--space-800)] pr-[20px]">
            <WizardSidebar currentStep="general-information" />

            <div className="flex-1 flex flex-col min-h-0 pl-[20px] pb-[var(--space-1400)]">
              <div className="flex flex-col items-start gap-[var(--space-800)] max-w-2xl">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h1 className="heading-400">
                    Get started with HubSpot payments
                  </h1>
                  <p className="body-100 text-hs-obsidian">
                    We collect this information to comply with financial and legal obligations.
                  </p>
                  <Div />
                </div>

                <div className="flex flex-col items-start gap-6 w-full max-w-md">
                  <Select
                    label="Where is your company located"
                    placeholder="Select country"
                    value={country}
                    options={COUNTRY_OPTIONS}
                    onChange={setCountry}
                    required
                    searchable
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-[330px] shrink-0 self-stretch"
            style={{ backgroundColor: "var(--Accent-Gypsum, #f5f8fa)" }}
          />
        </div>
      </div>

      <WizardFooter
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!country}
      />
    </div>
  );
}
