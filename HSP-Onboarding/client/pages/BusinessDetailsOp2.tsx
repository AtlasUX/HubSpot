import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { US_STATE_OPTIONS } from "@shared/usStates";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm";

const labelClass = "text-sm font-semibold text-hs-obsidian";
const hintClass = "text-xs text-hs-text-subtle";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className={hintClass}>{hint}</p>}
      {children}
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-0.5 pb-1 border-b border-gray-100">
      <h2 className="text-base font-semibold text-hs-obsidian">{title}</h2>
      <p className="text-sm text-hs-text-subtle">{subtitle}</p>
    </div>
  );
}

interface AddressSuggestion {
  street: string;
  city: string;
  state: string;
  zip: string;
}

const SIMULATED_ADDRESSES: AddressSuggestion[] = [
  { street: "100 Main Street", city: "Austin", state: "TX", zip: "78701" },
  { street: "100 Main Street Suite 200", city: "Denver", state: "CO", zip: "80203" },
  { street: "1000 Market Street", city: "San Francisco", state: "CA", zip: "94102" },
  { street: "1000 Market Street Floor 3", city: "Philadelphia", state: "PA", zip: "19107" },
  { street: "10 Industrial Blvd", city: "Atlanta", state: "GA", zip: "30301" },
  { street: "101 Commerce Drive", city: "Chicago", state: "IL", zip: "60601" },
  { street: "250 Broadway", city: "New York", state: "NY", zip: "10007" },
  { street: "2500 Technology Pkwy", city: "Seattle", state: "WA", zip: "98101" },
  { street: "500 Oak Avenue", city: "Boston", state: "MA", zip: "02108" },
  { street: "500 Oak Avenue Unit 4B", city: "Portland", state: "OR", zip: "97201" },
];

function getAddressSuggestions(query: string): AddressSuggestion[] {
  const q = query.toLowerCase();
  return SIMULATED_ADDRESSES
    .filter((a) =>
      a.street.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    )
    .slice(0, 5);
}

export default function BusinessDetailsOp2() {
  const navigate = useNavigate();
  const {
    businessAddressStreet, setBusinessAddressStreet,
    businessAddressStreetLine2, setBusinessAddressStreetLine2,
    businessAddressCity, setBusinessAddressCity,
    businessAddressState, setBusinessAddressState,
    businessAddressZip, setBusinessAddressZip,
    businessWebsite, setBusinessWebsite,
    contactEmail, setContactEmail,
    businessPhone, setBusinessPhone,
    supportEmail, setSupportEmail,
    supportPhone, setSupportPhone,
    bankStatementDescription, setBankStatementDescription,
    doingBusinessAs,
  } = useOnboarding();

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (businessAddressStreet.length >= 3 && addressFocused) {
      const results = getAddressSuggestions(businessAddressStreet);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [businessAddressStreet, addressFocused]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function applyAddress(suggestion: AddressSuggestion) {
    setBusinessAddressStreet(suggestion.street);
    setBusinessAddressCity(suggestion.city);
    setBusinessAddressState(suggestion.state);
    setBusinessAddressZip(suggestion.zip);
    setShowSuggestions(false);
  }

  const isValid =
    businessAddressStreet.trim().length > 0 &&
    businessAddressCity.trim().length > 0 &&
    businessAddressState.length > 0 &&
    businessAddressZip.trim().length >= 5 &&
    businessWebsite.trim().length > 0 &&
    contactEmail.trim().length > 0 &&
    businessPhone.trim().length > 0 &&
    supportEmail.trim().length > 0 &&
    supportPhone.trim().length > 0 &&
    bankStatementDescription.trim().length >= 5 &&
    /[a-zA-Z]/.test(bankStatementDescription);

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />
      <div className="flex items-center px-8 pt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-hs-text-subtle hover:text-[#0091AE] transition-colors"
        >
          ← Back to application
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 overflow-y-auto">
        <div className="flex flex-col gap-10 w-full max-w-2xl py-10">

          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-semibold text-hs-obsidian leading-tight">
              Address & contact
            </h1>
            <p className="text-base text-hs-text-subtle">
              Where you operate and how customers reach you.
            </p>
          </div>

          {/* Registered address */}
          <div className="flex flex-col gap-5">
            <SectionHeading
              title="Registered business address"
              subtitle="The legal address of your business as registered with authorities"
            />

            <Field label="Address line 1" required>
              <div className="relative" ref={suggestionsRef}>
                <input
                  type="text"
                  value={businessAddressStreet}
                  onChange={(e) => setBusinessAddressStreet(e.target.value)}
                  onFocus={() => setAddressFocused(true)}
                  onBlur={() => setAddressFocused(false)}
                  placeholder="Street address"
                  className={inputClass}
                  autoComplete="off"
                />
                {showSuggestions && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => applyAddress(s)}
                        className="flex flex-col w-full px-4 py-2.5 text-left hover:bg-[#f0fafb] transition-colors border-b border-gray-50 last:border-0"
                      >
                        <span className="text-sm text-hs-obsidian">{s.street}</span>
                        <span className="text-xs text-hs-text-subtle">{s.city}, {s.state} {s.zip}</span>
                      </button>
                    ))}
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                      <span className="text-xs text-hs-text-subtle">Selecting will fill city, state, and ZIP</span>
                    </div>
                  </div>
                )}
              </div>
            </Field>

            <Field label="Address line 2">
              <input
                type="text"
                value={businessAddressStreetLine2}
                onChange={(e) => setBusinessAddressStreetLine2(e.target.value)}
                placeholder="Suite, unit, building (optional)"
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 flex flex-col gap-1.5">
                <label className={labelClass}>
                  City<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={businessAddressCity}
                  onChange={(e) => setBusinessAddressCity(e.target.value)}
                  placeholder="City"
                  className={inputClass}
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className={labelClass}>
                  State<span className="text-red-500 ml-0.5">*</span>
                </label>
                <select
                  value={businessAddressState}
                  onChange={(e) => setBusinessAddressState(e.target.value)}
                  className={`${inputClass} bg-white`}
                >
                  <option value="">State</option>
                  {US_STATE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className={labelClass}>
                  ZIP code<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  value={businessAddressZip}
                  onChange={(e) => setBusinessAddressZip(e.target.value)}
                  placeholder="00000"
                  maxLength={10}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Online presence */}
          <div className="flex flex-col gap-5">
            <SectionHeading
              title="Online presence"
              subtitle="How customers find your business online"
            />

            <Field
              label="Business website"
              hint="No website? Use a social media profile or app store link instead."
              required
            >
              <input
                type="url"
                value={businessWebsite}
                onChange={(e) => setBusinessWebsite(e.target.value)}
                placeholder="https://example.com"
                className={inputClass}
              />
            </Field>

            <Field label="Business email" required>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hello@example.com"
                className={inputClass}
              />
            </Field>

            <Field label="Business phone" required>
              <input
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Customer support contact */}
          <div className="flex flex-col gap-5">
            <SectionHeading
              title="Customer support contact"
              subtitle="Shown to customers on receipts and payment pages — editable anytime in settings"
            />

            <Field label="Support email" required>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@example.com"
                className={inputClass}
              />
            </Field>

            <Field label="Support phone" required>
              <input
                type="tel"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={inputClass}
              />
            </Field>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Bank statement description<span className="text-red-500 ml-0.5">*</span>
              </label>
              <p className={hintClass}>
                This is what appears on your customers&rsquo; bank statements. Use 5–22 characters with at least 1 letter. No &lt; &gt; &quot; &apos; or * characters.
              </p>
              <input
                type="text"
                value={bankStatementDescription}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[<>"'*]/g, "");
                  if (cleaned.length <= 22) setBankStatementDescription(cleaned);
                }}
                placeholder={doingBusinessAs || "Your business name"}
                maxLength={22}
                className={inputClass}
              />
              <div className="flex justify-between">
                <span className={`text-xs ${
                  bankStatementDescription.length > 0 && bankStatementDescription.length < 5
                    ? "text-red-500"
                    : "text-hs-text-subtle"
                }`}>
                  {bankStatementDescription.length > 0 && bankStatementDescription.length < 5
                    ? `${5 - bankStatementDescription.length} more characters needed`
                    : "Customers will see this on their card statement"}
                </span>
                <span className="text-xs text-hs-text-subtle">
                  {bankStatementDescription.length}/22
                </span>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="pb-10">
            <button
              onClick={() => navigate("/dashboard")}
              disabled={!isValid}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                isValid
                  ? "bg-[#141414] text-white hover:bg-[#2d2d2d] hover:shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Save & return to application
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
