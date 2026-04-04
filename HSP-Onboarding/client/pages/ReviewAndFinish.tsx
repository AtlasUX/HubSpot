import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COUNTRY_OPTIONS } from "@shared/countries";
import {
  OnboardingHeader,
  Div,
  ReviewCard,
  ReviewCardField,
  CheckboxIndicator,
  FormLabel,
} from "design-system/components";
import { useOnboarding, type BusinessStructureOption } from "@/contexts/OnboardingContext";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";
import RestartApplicationModal from "@/components/RestartApplicationModal";

const BUSINESS_STRUCTURE_LABELS: Record<BusinessStructureOption, string> = {
  "sole-proprietorship": "Sole proprietorship",
  "single-member-llc": "Single-member LLC",
  "multi-member-llc": "Multi-member LLC",
  "private-partnership": "Private partnership",
  "private-corporation": "Private corporation",
  other: "Other/I'm not sure",
};

const BUSINESS_TYPE_LABELS = {
  individual: "Individual",
  nonprofit: "Nonprofit",
  company: "Company",
} as const;

const INDUSTRY_OPTIONS = [
  { value: "computers", label: "Computers and Computer Peripheral Equipment and Software" },
  { value: "retail", label: "Retail" },
  { value: "services", label: "Professional Services" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

export default function ReviewAndFinish() {
  const navigate = useNavigate();
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const {
    resetOnboarding,
    country,
    selectedBusinessType,
    businessStructure,
    hasConfirmedBusinessType: _hasConfirmedBusinessType,
    legalBusinessName,
    doingBusinessAs,
    industry,
    productsOrServices,
    businessPhone,
    businessPhoneCountryCode,
    businessAddressStreet,
    businessAddressStreetLine2,
    businessAddressCity,
    businessAddressState,
    businessAddressZip,
    businessWebsite,
    contactEmail,
    supportEmail,
    supportPhone,
    supportPhoneCountryCode,
    timeInBusiness,
    averageTransactionAmount,
    monthlyTransactionVolume,
    ein,
    bankStatementDescription,
    repFirstName,
    repLastName,
    repEmail,
    repJobTitle,
    repDateOfBirth,
    repAddressStreet,
    repAddressCity,
    repAddressState,
    repAddressZip,
    repAddressCountry,
    repPhone,
    repPhoneCountryCode,
    repSsnLast4,
    ownerFirstName,
    ownerLastName,
    ownerEmail,
    ownerJobTitle,
    ownerDateOfBirth,
    ownerAddressStreet,
    ownerAddressCity,
    ownerAddressState,
    ownerAddressZip,
    ownerAddressCountry,
    ownerPhone,
    ownerPhoneCountryCode,
    ownerSsnLast4,
  } = useOnboarding();

  const handleBack = () => {
    navigate("/owners");
  };

  const handleNext = () => {
    // TODO: Submit / finish flow
    console.log("Finish application");
  };

  const businessStructureLabel = businessStructure
    ? BUSINESS_STRUCTURE_LABELS[businessStructure]
    : "";

  const businessTypeLabel = selectedBusinessType
    ? BUSINESS_TYPE_LABELS[selectedBusinessType]
    : "";

  const industryLabel = industry
    ? INDUSTRY_OPTIONS.find((o) => o.value === industry)?.label ?? industry
    : "";

  const displayAddress =
    businessAddressStreet ||
    businessAddressStreetLine2 ||
    businessAddressCity ||
    businessAddressState ||
    businessAddressZip
      ? [
          businessAddressStreet,
          businessAddressStreetLine2,
          `${[businessAddressCity, businessAddressState].filter(Boolean).join(", ")} ${businessAddressZip}`.trim(),
        ]
          .filter(Boolean)
          .join("\n")
      : "";

  const displayBusinessPhone =
    businessPhone
      ? (businessPhoneCountryCode === "US" ? `+1 ${businessPhone}` : `+${businessPhoneCountryCode} ${businessPhone}`)
      : "";

  const displaySupportPhone =
    supportPhone
      ? (supportPhoneCountryCode === "US" ? `+1 ${supportPhone}` : `+${supportPhoneCountryCode} ${supportPhone}`)
      : "";

  const displayEin = ein ? "*********" : "";

  const repFullName = [repFirstName, repLastName].filter(Boolean).join(" ");
  const displayRepAddress =
    repAddressStreet || repAddressCity || repAddressState || repAddressZip || repAddressCountry
      ? [
          repAddressStreet,
          [repAddressCity, repAddressState].filter(Boolean).length
            ? `${[repAddressCity, repAddressState].filter(Boolean).join(", ")} ${repAddressZip}`.trim()
            : repAddressZip,
          repAddressCountry,
        ]
          .filter(Boolean)
          .join("\n")
      : "";
  const displayRepPhone =
    repPhone
      ? (repPhoneCountryCode === "US" ? `+1 ${repPhone}` : `+${repPhoneCountryCode} ${repPhone}`)
      : "";
  const displayRepSsnLast4 = repSsnLast4 ? "****" : "";

  const ownerFullName = [ownerFirstName, ownerLastName].filter(Boolean).join(" ");
  const displayOwnerAddress =
    ownerAddressStreet || ownerAddressCity || ownerAddressState || ownerAddressZip || ownerAddressCountry
      ? [
          ownerAddressStreet,
          [ownerAddressCity, ownerAddressState].filter(Boolean).length
            ? `${[ownerAddressCity, ownerAddressState].filter(Boolean).join(", ")} ${ownerAddressZip}`.trim()
            : ownerAddressZip,
          ownerAddressCountry,
        ]
          .filter(Boolean)
          .join("\n")
      : "";
  const displayOwnerPhone =
    ownerPhone
      ? (ownerPhoneCountryCode === "US" ? `+1 ${ownerPhone}` : `+${ownerPhoneCountryCode} ${ownerPhone}`)
      : "";
  const displayOwnerSsnLast4 = ownerSsnLast4 ? "****" : "";

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex min-h-full">
          <div className="flex flex-1 min-h-0 pl-0 py-[var(--space-800)] pr-[20px]">
            <WizardSidebar currentStep="review-and-finish" />

            <div className="flex-1 flex flex-col min-h-0 pl-[20px] pb-[var(--space-1400)]">
              <div className="flex flex-col items-start gap-[var(--space-800)] max-w-2xl">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h1 className="heading-400">Review & finish</h1>
                  <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on]">
                    You&apos;re nearly there! Take a moment to review and confirm your business information.
                  </p>
                  <Div />
                </div>

                <div className="flex flex-col items-start gap-[var(--space-800)] w-full">
                  <ReviewCard
                    label="General information"
                    onEditClick={() => navigate("/general-information")}
                  >
                    <ReviewCardField
                      label="Where is your company located"
                      value={country ? (COUNTRY_OPTIONS.find((c) => c.value === country)?.label ?? country) : "—"}
                    />
                  </ReviewCard>

                  <ReviewCard label="Business type" variant="muted">
                    <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on] w-full">
                      Your business type cannot be changed. To select a different business type, you will need to{" "}
                      <button
                        type="button"
                        onClick={() => setRestartModalOpen(true)}
                        className="link-100 bg-transparent border-0 p-0 cursor-pointer text-left inline"
                      >
                        restart your application
                      </button>
                      .
                    </p>
                    <ReviewCardField
                      label="Type of business"
                      value={businessTypeLabel || "Company"}
                    />
                    {(selectedBusinessType === "company" || !selectedBusinessType) && (
                      <ReviewCardField
                        label="Business structure"
                        value={businessStructureLabel || "Multi-member LLC"}
                      />
                    )}
                  </ReviewCard>

                  <ReviewCard
                    label="Business industry"
                    onEditClick={() => navigate("/business-information")}
                  >
                    <ReviewCardField
                      label="Legal company name"
                      value={legalBusinessName}
                    />
                    <ReviewCardField
                      label="Doing business as"
                      value={doingBusinessAs}
                    />
                    <ReviewCardField label="Industry" value={industryLabel} />
                    <ReviewCardField
                      label="What products or services will you collect payments for?"
                      value={productsOrServices}
                    />
                  </ReviewCard>

                  <ReviewCard
                    label="Business details"
                    onEditClick={() => navigate("/business-address-and-support")}
                  >
                    <ReviewCardField
                      label="Registered business address"
                      value={displayAddress}
                      multiline
                    />
                    <ReviewCardField
                      label="Business website URL"
                      value={businessWebsite}
                    />
                    <ReviewCardField label="Business email" value={contactEmail} />
                    <ReviewCardField label="Support email" value={supportEmail} />
                    <ReviewCardField
                      label="Business phone number"
                      value={displayBusinessPhone}
                    />
                    <ReviewCardField
                      label="Support phone number"
                      value={displaySupportPhone}
                    />
                  </ReviewCard>

                  <ReviewCard
                    label="Business financials"
                    onEditClick={() => navigate("/business-financials")}
                  >
                    <ReviewCardField
                      label="How long has your company been in business?"
                      value={timeInBusiness}
                    />
                    <ReviewCardField
                      label="Average transaction amount"
                      value={averageTransactionAmount}
                    />
                    <ReviewCardField
                      label="Monthly transaction volume"
                      value={monthlyTransactionVolume}
                    />
                    <ReviewCardField
                      label="Employer Identification Number (EIN)"
                      value={displayEin}
                    />
                    <ReviewCardField
                      label="Bank statement description"
                      value={bankStatementDescription}
                    />
                  </ReviewCard>

                  <ReviewCard
                    label="Business representative"
                    onEditClick={() => navigate("/business-representative")}
                  >
                    <ReviewCardField
                      label="First name Last name"
                      value={repFullName}
                    />
                    <ReviewCardField label="Email" value={repEmail} />
                    <ReviewCardField label="Job title" value={repJobTitle} />
                    <ReviewCardField
                      label="Date of birth"
                      value={repDateOfBirth}
                    />
                    <ReviewCardField
                      label="Home address"
                      value={displayRepAddress}
                      multiline
                    />
                    <ReviewCardField
                      label="Phone number"
                      value={displayRepPhone}
                    />
                    <ReviewCardField
                      label="Last 4 digits of Social Security number"
                      value={displayRepSsnLast4}
                    />
                  </ReviewCard>

                  <ReviewCard
                    label="Owner(s)"
                    onEditClick={() => navigate("/owners")}
                  >
                    <ReviewCardField
                      label="First name Last name"
                      value={ownerFullName}
                    />
                    <ReviewCardField label="Email" value={ownerEmail} />
                    <ReviewCardField label="Job title" value={ownerJobTitle} />
                    <ReviewCardField
                      label="Date of birth"
                      value={ownerDateOfBirth}
                    />
                    <ReviewCardField
                      label="Home address"
                      value={displayOwnerAddress}
                      multiline
                    />
                    <ReviewCardField
                      label="Phone number"
                      value={displayOwnerPhone}
                    />
                    <ReviewCardField
                      label="Last 4 digits of Social Security number"
                      value={displayOwnerSsnLast4}
                    />
                  </ReviewCard>

                  <div className="flex flex-col items-start gap-[var(--space-200)]">
                    <FormLabel required as="p">
                      Please accept the terms and conditions before you submit
                    </FormLabel>
                    <div className="flex flex-wrap items-center gap-x-[var(--space-100)] [font-feature-settings:'ss01'_on]">
                      <div
                        role="checkbox"
                        tabIndex={0}
                        onClick={() => setAcceptedTerms((prev) => !prev)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setAcceptedTerms((prev) => !prev);
                          }
                        }}
                        className="flex cursor-pointer items-center gap-[var(--space-300)] shrink-0"
                        aria-checked={acceptedTerms}
                        aria-label="I agree to the Terms & Conditions"
                      >
                        <span
                          className="inline-flex shrink-0 items-center justify-center self-center rounded-[var(--borderRadius-100)] border bg-[var(--color-fill-field-default-alt,#fff)] p-[var(--space-0)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-1"
                          style={{
                            width: 21,
                            height: 21,
                            gap: "var(--space-0, 0)",
                            borderColor: acceptedTerms
                              ? "var(--color-border-interactive-pressed, #141414)"
                              : "var(--color-border-core-default, #8a8a8a)",
                            color: "var(--color-icon-interactive-default, #141414)",
                          }}
                        >
                          {acceptedTerms && <CheckboxIndicator />}
                        </span>
                        <span className="body-100 text-[var(--color-text-core-default,#141414)] whitespace-nowrap">
                          I agree to the
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open("/terms", "_blank", "noopener,noreferrer");
                        }}
                        className="link-100 hover:opacity-80 bg-transparent border-0 p-0 cursor-pointer text-left inline font-inherit"
                      >
                        Terms & Conditions
                      </button>
                    </div>
                  </div>
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
        nextDisabled={!acceptedTerms}
        nextLabel="Submit"
      />

      <RestartApplicationModal
        open={restartModalOpen}
        onClose={() => setRestartModalOpen(false)}
        onConfirm={() => {
          setRestartModalOpen(false);
          resetOnboarding();
          navigate("/general-information", { state: { restartSuccess: true } });
        }}
      />
    </div>
  );
}
