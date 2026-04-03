import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OnboardingHeader, Toast } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";

const SUPPORTED_COUNTRIES = [
  { value: "US", label: "United States", flag: "🇺🇸" },
  { value: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { value: "CA", label: "Canada", flag: "🇨🇦" },
];

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

  const handleSelect = (value: string) => {
    setCountry(value);
    navigate("/business-type", { replace: false });
  };

  const handleBack = () => {
    console.log("Back clicked");
    // TODO: Navigate to Processor Selection
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
                <div className="flex flex-col items-start gap-2 w-full">
                  <h1 className="heading-400">Where is your company located?</h1>
                  <p className="body-100 text-hs-text-subtle">
                    We currently support the following countries.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-sm">
                  {SUPPORTED_COUNTRIES.map(({ value, label, flag }) => (
                    <button
                      key={value}
                      onClick={() => handleSelect(value)}
                      className={`flex items-center gap-4 w-full px-5 py-4 rounded-lg border-2 text-left transition-all duration-150
                        ${country === value
                          ? "border-[#4ABACD] bg-[#E8F4F7]"
                          : "border-gray-200 bg-white hover:border-[#4ABACD] hover:bg-[#f5fbfc]"
                        }`}
                    >
                      <span className="text-2xl">{flag}</span>
                      <span className="text-hs-obsidian font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                <p className="body-100 text-hs-text-subtle">
                  Live outside these countries?{" "}
                  <a href="#" className="text-[#0091AE] underline hover:text-[#007a94]">
                    You can sign up for Stripe Payments
                  </a>
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

      <WizardFooter
        onBack={handleBack}
        onNext={() => navigate("/business-type")}
        nextDisabled={!country}
      />
    </div>
  );
}
