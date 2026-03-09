import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  OnboardingHeader,
  Div,
  FormLabel,
  Select,
  TextField,
  PhoneNumber,
  OnboardingTooltip,
} from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import WizardSidebar from "@/components/WizardSidebar";
import WizardFooter from "@/components/WizardFooter";
import { US_STATE_OPTIONS } from "@shared/usStates";

type FocusedField =
  | "legal-business-name"
  | "doing-business-as"
  | "ein"
  | "address-line-1"
  | "address-line-2"
  | "city"
  | "state"
  | "zip"
  | "contact-email"
  | "business-website"
  | "support-email"
  | "business-phone"
  | "support-phone"
  | null;

export default function BusinessAddressAndSupport() {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const {
    legalBusinessName,
    setLegalBusinessName,
    doingBusinessAs,
    setDoingBusinessAs,
    ein,
    setEin,
    businessAddressStreet,
    setBusinessAddressStreet,
    businessAddressStreetLine2,
    setBusinessAddressStreetLine2,
    businessAddressCity,
    setBusinessAddressCity,
    businessAddressState,
    setBusinessAddressState,
    businessAddressZip,
    setBusinessAddressZip,
    businessWebsite,
    setBusinessWebsite,
    contactEmail,
    setContactEmail,
    supportEmail,
    setSupportEmail,
    supportPhone,
    setSupportPhone,
    supportPhoneCountryCode,
    setSupportPhoneCountryCode,
    businessPhone,
    setBusinessPhone,
    businessPhoneCountryCode,
    setBusinessPhoneCountryCode,
  } = useOnboarding();

  const handleBack = () => {
    navigate("/business-information");
  };

  const handleNext = () => {
    navigate("/business-financials");
  };

  const isValid =
    legalBusinessName.trim().length > 0 &&
    ein.trim().length >= 9 &&
    businessAddressStreet.trim().length > 0 &&
    businessAddressCity.trim().length > 0 &&
    businessAddressState.length > 0 &&
    businessAddressZip.trim().length > 0 &&
    businessWebsite.trim().length > 0 &&
    contactEmail.trim().length > 0 &&
    supportEmail.trim().length > 0 &&
    businessPhone.trim().length > 0 &&
    supportPhone.trim().length > 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex min-h-full">
          <div className="flex flex-1 min-h-0 pl-0 py-[var(--space-800)] pr-[20px]">
            <WizardSidebar currentStep="business-address-and-support" />

            <div className="flex-1 flex flex-col min-h-0 pl-[20px] pb-[var(--space-1400)]">
              <div className="flex flex-col items-start gap-[var(--space-800)] max-w-2xl">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h1 className="heading-400">
                    Business details
                  </h1>
                  <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on]">
                    The combination of your company's legal business name and Employer Identification Number (EIN) must exactly match the one listed on your IRS documents (e.g., Letter 147C or SS-4 Confirmation letter), including capitalization, symbols, and punctuation.
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

                  <TextField
                    label="Employer Identification Number (EIN)"
                    value={ein}
                    onChange={setEin}
                    placeholder="00-0000000"
                    required
                    minLength={9}
                    onFocus={() => setFocusedField("ein")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <div className="flex flex-col items-start gap-[var(--space-200)] w-full">
                    <FormLabel as="p" required fullWidth>
                      Registered business address
                    </FormLabel>
                    <TextField
                      value={businessAddressStreet}
                      onChange={setBusinessAddressStreet}
                      placeholder="Address line 1"
                      required
                      onFocus={() => setFocusedField("address-line-1")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <TextField
                      value={businessAddressStreetLine2}
                      onChange={setBusinessAddressStreetLine2}
                      placeholder="Address line 2"
                      onFocus={() => setFocusedField("address-line-2")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  <TextField
                    label="City"
                    value={businessAddressCity}
                    onChange={setBusinessAddressCity}
                    required
                    onFocus={() => setFocusedField("city")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <Select
                    label="State"
                    placeholder="Select your state"
                    value={businessAddressState}
                    options={US_STATE_OPTIONS}
                    onChange={setBusinessAddressState}
                    required
                    searchable
                    onFocus={() => setFocusedField("state")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <TextField
                    label="Zip code"
                    value={businessAddressZip}
                    onChange={setBusinessAddressZip}
                    required
                    onFocus={() => setFocusedField("zip")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <TextField
                    label="Business website URL"
                    value={businessWebsite}
                    onChange={setBusinessWebsite}
                    placeholder="https://example.com"
                    required
                    onFocus={() => setFocusedField("business-website")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <TextField
                    label="Business email"
                    value={contactEmail}
                    onChange={setContactEmail}
                    type="email"
                    required
                    onFocus={() => setFocusedField("contact-email")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <TextField
                    label="Support email"
                    value={supportEmail}
                    onChange={setSupportEmail}
                    type="email"
                    required
                    onFocus={() => setFocusedField("support-email")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <PhoneNumber
                    label="Business phone number"
                    countryCode={businessPhoneCountryCode}
                    value={businessPhone}
                    onChange={(code, number) => {
                      setBusinessPhoneCountryCode(code);
                      setBusinessPhone(number);
                    }}
                    required
                    onFocus={() => setFocusedField("business-phone")}
                    onBlur={() => setFocusedField(null)}
                  />

                  <PhoneNumber
                    label="Support phone number"
                    countryCode={supportPhoneCountryCode}
                    value={supportPhone}
                    onChange={(code, number) => {
                      setSupportPhoneCountryCode(code);
                      setSupportPhone(number);
                    }}
                    required
                    onFocus={() => setFocusedField("support-phone")}
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
            <div className="flex flex-col items-start gap-[var(--space-800)] w-full">
              <div className="flex flex-col items-start gap-4 w-full invisible pointer-events-none select-none" aria-hidden>
                <h1 className="heading-400">Business details</h1>
                <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on]">
                  The combination of your company's legal business name and Employer Identification Number (EIN) must exactly match the one listed on your IRS documents (e.g., Letter 147C or SS-4 Confirmation letter), including capitalization, symbols, and punctuation.
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
                    description={`Your legal business name must match the one listed on your IRS documents exactly (e.g. Letter 147C or SS-4 confirmation letter), including capitalization, symbols and punctuation.



Customers will see this on sales receipts and other documents.`}
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField label="Doing business as" value="" onChange={() => {}} disabled />
                </div>
                {focusedField === "doing-business-as" && (
                  <OnboardingTooltip
                    title="Doing business as"
                    description="The operating name of your company, if it's different than the legal name."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField
                    label="Employer Identification Number (EIN)"
                    value=""
                    onChange={() => {}}
                    disabled
                  />
                </div>
                {focusedField === "ein" && (
                  <OnboardingTooltip
                    title="Employer Identification Number (EIN)"
                    description="Your EIN must match exactly what appears on your IRS documents."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <div className="flex flex-col items-start gap-[var(--space-200)] w-full">
                    <FormLabel as="p" required fullWidth>
                      Registered business address
                    </FormLabel>
                    <TextField value="" onChange={() => {}} placeholder="Address line 1" disabled />
                  </div>
                </div>
                {focusedField === "address-line-1" && (
                  <OnboardingTooltip
                    title="Registered business address"
                    description="The legal address of your business as registered with authorities."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField value="" onChange={() => {}} placeholder="Address line 2" disabled />
                </div>
                {focusedField === "address-line-2" && (
                  <OnboardingTooltip
                    title="Address line 2"
                    description="Apartment, suite, or other details if applicable."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField label="City" value="" onChange={() => {}} disabled />
                </div>
                {focusedField === "city" && (
                  <OnboardingTooltip
                    title="City"
                    description="The city where your business is located."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <Select label="State" value="" options={US_STATE_OPTIONS} onChange={() => {}} disabled />
                </div>
                {focusedField === "state" && (
                  <OnboardingTooltip
                    title="State"
                    description="The state or province where your business is located."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField label="Zip code" value="" onChange={() => {}} disabled />
                </div>
                {focusedField === "zip" && (
                  <OnboardingTooltip
                    title="Zip code"
                    description="Postal code for your business address."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField label="Business website URL" value="" onChange={() => {}} disabled />
                </div>
                {focusedField === "business-website" && (
                  <OnboardingTooltip
                    title="Business website URL"
                    description="Your company's website that customers can visit."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField label="Business email" value="" onChange={() => {}} disabled />
                </div>
                {focusedField === "contact-email" && (
                  <OnboardingTooltip
                    title="Business email"
                    description="Primary email address for your business."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <TextField label="Support email" value="" onChange={() => {}} disabled />
                </div>
                {focusedField === "support-email" && (
                  <OnboardingTooltip
                    title="Support email"
                    description="Email address where customers can reach your support team."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <PhoneNumber label="Business phone number" value="" countryCode="US" onChange={() => {}} disabled />
                </div>
                {focusedField === "business-phone" && (
                  <OnboardingTooltip
                    title="Business phone number"
                    description="A phone number where we can reach your business."
                    className="-mt-20"
                  />
                )}
                <div className="invisible pointer-events-none select-none" aria-hidden>
                  <PhoneNumber value="" countryCode="US" onChange={() => {}} disabled />
                </div>
                {focusedField === "support-phone" && (
                  <OnboardingTooltip
                    title="Support phone number"
                    description="Phone number where customers can reach your support team."
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
