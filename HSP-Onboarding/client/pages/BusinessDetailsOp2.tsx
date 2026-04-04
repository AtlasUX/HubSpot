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
              <input
                type="text"
                value={businessAddressStreet}
                onChange={(e) => setBusinessAddressStreet(e.target.value)}
                placeholder="Street address"
                className={inputClass}
              />
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
