import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Div, FormLabel, Select, OnboardingTooltip } from "design-system/components";
import {
  useOnboarding,
  type BusinessStructureOption,
} from "@/contexts/OnboardingContext";
import { OnboardingHeader } from "design-system/components";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";
import ConfirmBusinessTypeModal from "@/components/ConfirmBusinessTypeModal";
import RestartApplicationModal from "@/components/RestartApplicationModal";
import BusinessTypeCard, {
  IndividualIcon,
  NonprofitIcon,
  CompanyIcon,
} from "@/components/BusinessTypeCard";

const BUSINESS_STRUCTURE_OPTIONS = [
  { value: "sole-proprietorship", label: "Sole proprietorship" },
  { value: "single-member-llc", label: "Single-member LLC" },
  { value: "multi-member-llc", label: "Multi-member LLC" },
  { value: "private-partnership", label: "Private partnership" },
  { value: "private-corporation", label: "Private corporation" },
  { value: "other", label: "Other/I'm not sure" },
];

export default function BusinessType() {
  const navigate = useNavigate();
  const {
    selectedBusinessType,
    setSelectedBusinessType,
    businessStructure,
    setBusinessStructure,
    hasConfirmedBusinessType,
    setHasConfirmedBusinessType,
    resetOnboarding,
  } = useOnboarding();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [focusedTooltip, setFocusedTooltip] = useState<"business-classification" | null>(null);
  const businessClassificationRef = useRef<HTMLDivElement>(null);
  const businessStructureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedBusinessType === "company" && businessStructureRef.current) {
      businessStructureRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedBusinessType]);

  const handleBusinessTypeChange = (type: "individual" | "nonprofit" | "company") => {
    setSelectedBusinessType(type);
    if (type !== "company") {
      setBusinessStructure(null);
    }
  };

  const handleBack = () => {
    navigate(hasConfirmedBusinessType ? "/business-information" : "/general-information");
  };

  const handleNext = () => {
    if (hasConfirmedBusinessType) {
      navigate("/business-information");
    } else if (selectedBusinessType) {
      setConfirmModalOpen(true);
    }
  };

  const handleConfirm = () => {
    setConfirmModalOpen(false);
    setHasConfirmedBusinessType(true);
    navigate("/business-information");
  };

  const handleCancelConfirm = () => {
    setConfirmModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex min-h-full">
          <div className="flex flex-1 min-h-0 pl-0 py-[var(--space-800)] pr-[20px]">
            <WizardSidebar currentStep="business-type" />

            <div className="flex-1 flex flex-col min-h-0 pl-[20px] pb-[var(--space-1400)]">
              <div className="flex flex-col items-start gap-[var(--space-800)] max-w-2xl">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h1 className="heading-400">
                    Select your business type: test
                  </h1>
                  <Div />
                  {hasConfirmedBusinessType ? (
                    <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on] flex flex-col gap-[var(--space-100)]">
                      <span className="body-125">
                        Your business type cannot be changed.
                      </span>
                      <span>
                        To select a different business type, you will need to{" "}
                        <button
                          type="button"
                          onClick={() => setRestartModalOpen(true)}
                          className="link-100 bg-transparent border-0 p-0 cursor-pointer text-left inline"
                        >
                          restart your application
                        </button>
                        .
                      </span>
                    </p>
                  ) : (
                    <Alert
                      type="warning"
                      title
                      titleText="Your business type can't be changed after this step."
                      text="If you need to update it, you'll have to restart this application. Not sure? Check your registration documents or consult your accountant before continuing."
                    />
                  )}
                </div>

                <div
                  ref={businessClassificationRef}
                  tabIndex={0}
                  onFocus={() => setFocusedTooltip("business-classification")}
                  onBlur={(e) => {
                    if (!businessClassificationRef.current?.contains(e.relatedTarget as Node)) {
                      setFocusedTooltip(null);
                    }
                  }}
                  onClick={() => businessClassificationRef.current?.focus()}
                  className="flex flex-col items-start gap-2 w-full outline-none"
                >
                  <FormLabel required>
                    What is your legal business classification
                  </FormLabel>

                  <div className="flex flex-col items-start gap-6 w-full">
                    <BusinessTypeCard
                      title="Individual"
                      description="E.g. a small side business that is not incorporated, independent consultant, contractor, or freelancer"
                      icon={<IndividualIcon />}
                      selected={selectedBusinessType === "individual"}
                      disabled={hasConfirmedBusinessType}
                      onChange={() => handleBusinessTypeChange("individual")}
                    />

                    <BusinessTypeCard
                      title="Nonprofit"
                      description="E.g. a registered charity, religious organization, or foundation"
                      icon={<NonprofitIcon />}
                      selected={selectedBusinessType === "nonprofit"}
                      disabled={hasConfirmedBusinessType}
                      onChange={() => handleBusinessTypeChange("nonprofit")}
                    />

                    <BusinessTypeCard
                      title="Company"
                      description="E.g. multi-member LLC, private or public corporation"
                      icon={<CompanyIcon />}
                      selected={selectedBusinessType === "company"}
                      disabled={hasConfirmedBusinessType}
                      onChange={() => handleBusinessTypeChange("company")}
                    />

                    {selectedBusinessType === "company" && (
                      <div
                        ref={businessStructureRef}
                        className="flex flex-col items-start gap-2 w-full max-w-md"
                      >
                        <Select
                          label="Select your business structure"
                          placeholder="Select your business structure"
                          value={businessStructure ?? ""}
                          options={BUSINESS_STRUCTURE_OPTIONS}
                          onChange={(v) =>
                            setBusinessStructure(v as BusinessStructureOption)
                          }
                          required
                          disabled={hasConfirmedBusinessType}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-[330px] shrink-0 self-stretch flex flex-col py-[var(--space-800)] px-5"
            style={{ backgroundColor: "var(--Accent-Gypsum, #f5f8fa)" }}
          >
            {/* Spacers to align tooltip with "What is your legal business classification" label */}
            <div className="flex flex-col items-start gap-[var(--space-800)] w-full">
              <div className="flex flex-col items-start gap-4 w-full invisible pointer-events-none select-none" aria-hidden>
                <h1 className="heading-400">Select your business type</h1>
                <Div />
              </div>
              <div className="invisible pointer-events-none select-none" aria-hidden>
                {hasConfirmedBusinessType ? (
                  <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on] flex flex-col gap-[var(--space-100)]">
                    <span className="body-125">Your business type cannot be changed.</span>
                    <span>To select a different business type, you will need to restart your application.</span>
                  </p>
                ) : (
                  <Alert
                    type="warning"
                    title
                    titleText="Your business type can't be changed after this step."
                    text="If you need to update it, you'll have to restart this application. Not sure? Check your registration documents or consult your accountant before continuing."
                  />
                )}
              </div>
              {(focusedTooltip === "business-classification" || hasConfirmedBusinessType) && (
                <OnboardingTooltip
                  title="Business type"
                  description={"If you have not filed paperwork to register as a business entity, then your business type is likely to be Individual.\n\nIf you choose 'Individual' or 'Company structured as a Single Member LLC', please be aware that your 1099K and business taxes will be reported under your personal Social Security Number (SSN). If you would like your 1099K or taxes to be reported using your business tax ID, please DO NOT select 'Individual' or 'Single Member LLC'."}
                  className="-mt-20"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <WizardFooter
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={
          !hasConfirmedBusinessType &&
          (!selectedBusinessType ||
            (selectedBusinessType === "company" && !businessStructure))
        }
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

      {selectedBusinessType && (
        <ConfirmBusinessTypeModal
          open={confirmModalOpen}
          businessType={selectedBusinessType}
          businessStructure={selectedBusinessType === "company" ? businessStructure : null}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
        />
      )}
    </div>
  );
}
