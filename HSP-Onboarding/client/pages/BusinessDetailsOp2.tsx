import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { InviteModal } from "@/components/InviteModal";

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
    businessWebsite, setBusinessWebsite,
    contactEmail, setContactEmail,
    businessPhone, setBusinessPhone,
    supportEmail, setSupportEmail,
    supportPhone, setSupportPhone,
    addInvite,
  } = useOnboarding();
  const [showInvite, setShowInvite] = useState(false);

  const isValid =
    businessWebsite.trim().length > 0 &&
    contactEmail.trim().length > 0 &&
    businessPhone.trim().length > 0 &&
    supportEmail.trim().length > 0 &&
    supportPhone.trim().length > 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />
      <div className="flex items-center justify-between px-8 pt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-hs-text-subtle hover:text-[#0091AE] transition-colors"
        >
          ← All sections
        </button>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-hs-text-subtle hover:border-[#4ABACD] hover:text-[#4ABACD] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1 13c0-2.761 2.239-5 5-5M11 10v4M13 12h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Invite collaborator
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 overflow-y-auto">
        <div className="flex flex-col gap-10 w-full max-w-2xl py-10">

          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-semibold text-hs-obsidian leading-tight">
              Contact & support
            </h1>
            <p className="text-base text-hs-text-subtle">
              How customers find your business online and reach you for support.
            </p>
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
      {showInvite && (
        <InviteModal
          sectionTitle="Contact & support"
          onClose={() => setShowInvite(false)}
          onSend={addInvite}
        />
      )}
    </div>
  );
}
