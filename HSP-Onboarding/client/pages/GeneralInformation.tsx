import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { OnboardingHeader, Toast } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import PhaseProgress from "@/components/PhaseProgress";

const SUPPORTED_COUNTRIES = [
  { value: "US", label: "United States", flag: "🇺🇸" },
  { value: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { value: "CA", label: "Canada", flag: "🇨🇦" },
];

export default function GeneralInformation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCountry } = useOnboarding();
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
    navigate("/dashboard", { replace: false });
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
      <PhaseProgress />

      <div className="flex-1 flex flex-col items-center px-6 overflow-y-auto">
        <div className="flex flex-col items-center gap-10 w-full max-w-lg py-10 my-auto">

          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-[32px] font-semibold text-hs-obsidian leading-tight">
              Where is your company located?
            </h1>
            <p className="text-base text-hs-text-subtle">
              We currently support the following countries.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {SUPPORTED_COUNTRIES.map(({ value, label, flag }) => (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                className="group flex items-center gap-5 w-full px-6 py-5 rounded-xl border-2 border-gray-200 bg-white text-left transition-all duration-150 hover:border-[#4ABACD] hover:bg-[#f0fafb] hover:shadow-sm active:scale-[0.99]"
              >
                <span className="text-4xl">{flag}</span>
                <span className="text-lg font-semibold text-hs-obsidian group-hover:text-[#0091AE] transition-colors">
                  {label}
                </span>
                <span className="ml-auto text-gray-300 group-hover:text-[#4ABACD] text-xl transition-colors">→</span>
              </button>
            ))}
          </div>

          <p className="text-sm text-hs-text-subtle text-center">
            Live outside these countries?{" "}
            <a href="#" className="text-[#0091AE] underline hover:text-[#007a94]">
              You can sign up for Stripe Payments
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
