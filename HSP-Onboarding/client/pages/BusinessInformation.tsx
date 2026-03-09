import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader, Select, Div, TextField, OnboardingTooltip } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";

type FocusedField = "industry" | "products-services" | null;

const INDUSTRY_OPTIONS = [
  { value: "computers", label: "Computers and Computer Peripheral Equipment and Software" },
  {
    value: "programming",
    label: "Computer Programming, Data Processing, and Integrated Systems Design Services",
  },
  { value: "retail", label: "Retail" },
  { value: "services", label: "Professional Services" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

export default function BusinessInformation() {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const { industry, setIndustry, productsOrServices, setProductsOrServices } =
    useOnboarding();

  const handleBack = () => {
    navigate("/business-type");
  };

  const handleNext = () => {
    navigate("/business-address-and-support");
  };

  const isValid =
    industry.length > 0 && productsOrServices.trim().length >= 10;

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex min-h-full">
          <div className="flex flex-1 min-h-0 pl-0 py-[var(--space-800)] pr-[20px]">
            <WizardSidebar currentStep="business-information" />

            <div className="flex-1 flex flex-col min-h-0 pl-[20px] pb-[var(--space-1400)]">
              <div className="flex flex-col items-start gap-[var(--space-800)] max-w-2xl">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h1 className="heading-400">
                    Business industry
                  </h1>
                  <p className="body-100 text-hs-obsidian">
                    We collect this information to comply with financial and legal obligations.
                  </p>
                  <Div />
                </div>

                <div className="flex flex-col items-start gap-6 w-full max-w-md">
                  <Select
                    label="Industry"
                    placeholder="Select your industry"
                    value={industry}
                    options={INDUSTRY_OPTIONS}
                    onChange={setIndustry}
                    required
                    searchable
                    onFocus={() => setFocusedField("industry")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <TextField
                    label="What products or services will you collect payments for?"
                    value={productsOrServices}
                    onChange={setProductsOrServices}
                    placeholder="e.g. Website design and development services"
                    helperText="Use 10 or more characters."
                    required
                    minLength={10}
                    onFocus={() => setFocusedField("products-services")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-[330px] shrink-0 self-stretch flex flex-col py-[var(--space-800)] px-5"
            style={{ backgroundColor: "var(--Accent-Gypsum, #f5f8fa)" }}
          >
            {/* Spacers to align tooltip with focused field */}
            <div className="flex flex-col items-start gap-[var(--space-800)] w-full">
              <div className="flex flex-col items-start gap-4 w-full invisible pointer-events-none select-none" aria-hidden>
                <h1 className="heading-400">Business industry</h1>
                <p className="body-100 text-hs-obsidian">
                  We collect this information to comply with financial and legal obligations.
                </p>
                <Div />
              </div>
              <div className="flex flex-col items-start gap-6 w-full">
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <Select label="Industry" value="" options={INDUSTRY_OPTIONS} onChange={() => {}} disabled />
                </div>
                {focusedField === "industry" && (
                  <OnboardingTooltip
                    title="Industry"
                    description="Select the industry that best describes your business."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField
                    label="What products or services will you collect payments for?"
                    value=""
                    onChange={() => {}}
                    helperText="Use 10 or more characters."
                    disabled
                  />
                </div>
                {focusedField === "products-services" && (
                  <OnboardingTooltip
                    title="Products or services"
                    description="No need for a detailed list. We just need a general idea of what you plan to sell."
                    className="-mt-20"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <WizardFooter
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!isValid}
      />
    </div>
  );
}
