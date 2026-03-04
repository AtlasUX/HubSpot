import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader, Select, Div, TextField, PhoneNumber, OnboardingTooltip } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";

type FocusedField =
  | "legal-business-name"
  | "doing-business-as"
  | "industry"
  | "products-services"
  | "business-phone"
  | null;

const INDUSTRY_OPTIONS = [
  { value: "computers", label: "Computers and Computer Peripheral Equipment and Software" },
  { value: "retail", label: "Retail" },
  { value: "services", label: "Professional Services" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

export default function BusinessInformation() {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const {
    legalBusinessName,
    setLegalBusinessName,
    doingBusinessAs,
    setDoingBusinessAs,
    industry,
    setIndustry,
    productsOrServices,
    setProductsOrServices,
    businessPhone,
    setBusinessPhone,
    businessPhoneCountryCode,
    setBusinessPhoneCountryCode,
  } = useOnboarding();

  const handleBack = () => {
    navigate("/business-type");
  };

  const handleNext = () => {
    navigate("/business-address-and-support");
  };

  const isValid =
    legalBusinessName.trim().length > 0 &&
    industry.length > 0 &&
    productsOrServices.trim().length >= 10 &&
    businessPhone.trim().length > 0;

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
                    Edit business information
                  </h1>
                  <p className="body-100 text-hs-obsidian">
                    We collect this information to comply with financial and legal obligations.
                  </p>
                  <Div />
                </div>

                <div className="flex flex-col items-start gap-6 w-full max-w-md">
                  <TextField
                    label="Legal business name"
                    value={legalBusinessName}
                    onChange={setLegalBusinessName}
                    required
                    onFocus={() => setFocusedField("legal-business-name")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <TextField
                    label="Doing business as"
                    value={doingBusinessAs}
                    onChange={setDoingBusinessAs}
                    onFocus={() => setFocusedField("doing-business-as")}
                    onBlur={() => setFocusedField(null)}
                  />

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

                  <PhoneNumber
                    label="Business phone number"
                    countryCode={businessPhoneCountryCode}
                    value={businessPhone}
                    placeholder="(222) 232-3345"
                    onChange={(code, number) => {
                      setBusinessPhoneCountryCode(code);
                      setBusinessPhone(number);
                    }}
                    required
                    onFocus={() => setFocusedField("business-phone")}
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
                <h1 className="heading-400">Edit business information</h1>
                <p className="body-100 text-hs-obsidian">
                  We collect this information to comply with financial and legal obligations.
                </p>
                <Div />
              </div>
              <div className="flex flex-col items-start gap-6 w-full">
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField label="Legal business name" value="" onChange={() => {}} disabled />
                </div>
                {focusedField === "legal-business-name" && (
                  <OnboardingTooltip
                    title="Legal business name"
                    description="Customers will see this on sales receipts and other documents."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField label="Doing business as" value="" onChange={() => {}} disabled />
                </div>
                {focusedField === "doing-business-as" && (
                  <OnboardingTooltip
                    title="Doing business as (DBA)"
                    description="The operating name of your company, if it's different than the legal name."
                    className="-mt-20"
                  />
                )}
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
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <PhoneNumber value="" countryCode="US" onChange={() => {}} disabled />
                </div>
                {focusedField === "business-phone" && (
                  <OnboardingTooltip
                    title="Business phone number"
                    description="A phone number where we can reach your business. This may be used for verification."
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
