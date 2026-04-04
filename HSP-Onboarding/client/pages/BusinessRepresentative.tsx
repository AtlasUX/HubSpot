import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { US_STATE_OPTIONS } from "@shared/usStates";
import { InviteModal } from "@/components/InviteModal";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm";

const labelClass = "text-sm font-semibold text-hs-obsidian";

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-0.5 pb-1 border-b border-gray-100">
      <h2 className="text-base font-semibold text-hs-obsidian">{title}</h2>
      {subtitle && <p className="text-sm text-hs-text-subtle">{subtitle}</p>}
    </div>
  );
}

type IdUploadState = "idle" | "processing" | "preview";

interface IdExtracted {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

function simulateIdExtraction(): Promise<IdExtracted> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        firstName: "Jordan",
        lastName: "Rivera",
        dateOfBirth: "1988-03-15",
        street: "742 Evergreen Terrace",
        city: "Springfield",
        state: "IL",
        zip: "62701",
      });
    }, 2200)
  );
}

function IdUploadCard({ onApply }: { onApply: (data: IdExtracted) => void }) {
  const [state, setState] = useState<IdUploadState>("idle");
  const [preview, setPreview] = useState<IdExtracted | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile() {
    setState("processing");
    const data = await simulateIdExtraction();
    setPreview({ ...data });
    setState("preview");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFile();
  }

  if (state === "idle") {
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all ${
          isDragging ? "border-[#4ABACD] bg-[#f0fafb]" : "border-gray-200 hover:border-[#4ABACD] hover:bg-[#f0fafb]"
        }`}
      >
        <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
        <div className="w-10 h-10 rounded-full bg-[#f0fafb] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#4ABACD]">
            <path d="M3 14v3h14v-3M10 3v10M6 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="text-sm font-semibold text-hs-obsidian">Upload driver's license or passport</span>
          <span className="text-xs text-hs-text-subtle">Drag & drop or click · JPG, PNG, or PDF</span>
        </div>
        <span className="text-xs text-[#4ABACD] font-medium">Auto-fills name, DOB & address</span>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <div className="w-8 h-8 border-2 border-[#4ABACD] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-hs-text-subtle">Reading ID document…</span>
      </div>
    );
  }

  if (state === "preview" && preview) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-[#4ABACD]/30 bg-[#f0fafb] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#4ABACD" />
              <path d="M4.5 8l2.5 2.5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold text-hs-obsidian">ID extracted — review & apply</span>
          </div>
          <button
            onClick={() => { setState("idle"); setPreview(null); }}
            className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide">First name</span>
            <input type="text" value={preview.firstName} onChange={(e) => setPreview({ ...preview, firstName: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide">Last name</span>
            <input type="text" value={preview.lastName} onChange={(e) => setPreview({ ...preview, lastName: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide">Date of birth</span>
            <input type="date" value={preview.dateOfBirth} onChange={(e) => setPreview({ ...preview, dateOfBirth: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide">Street</span>
            <input type="text" value={preview.street} onChange={(e) => setPreview({ ...preview, street: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide">City</span>
            <input type="text" value={preview.city} onChange={(e) => setPreview({ ...preview, city: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide">State</span>
              <input type="text" value={preview.state} onChange={(e) => setPreview({ ...preview, state: e.target.value })} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide">ZIP</span>
              <input type="text" value={preview.zip} onChange={(e) => setPreview({ ...preview, zip: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        <button
          onClick={() => onApply(preview)}
          className="w-full py-2.5 bg-[#4ABACD] text-white rounded-lg text-sm font-semibold hover:bg-[#3aa8bb] transition-colors"
        >
          Apply to form →
        </button>
      </div>
    );
  }

  return null;
}

const PHONE_COUNTRIES = [
  { code: "US", flag: "🇺🇸", dial: "+1" },
  { code: "GB", flag: "🇬🇧", dial: "+44" },
  { code: "CA", flag: "🇨🇦", dial: "+1" },
];

export default function BusinessRepresentative() {
  const navigate = useNavigate();
  const {
    repFirstName, setRepFirstName,
    repLastName, setRepLastName,
    repEmail, setRepEmail,
    repDateOfBirth, setRepDateOfBirth,
    repAddressStreet, setRepAddressStreet,
    repAddressCity, setRepAddressCity,
    repAddressState, setRepAddressState,
    repAddressZip, setRepAddressZip,
    repPhone, setRepPhone,
    repPhoneCountryCode, setRepPhoneCountryCode,
    repSsnLast4, setRepSsnLast4,
  } = useOnboarding();

  const [addressLine2, setAddressLine2] = useState("");
  const [isControl, setIsControl] = useState(false);
  const [showSsn, setShowSsn] = useState(false);

  function applyIdData(data: IdExtracted) {
    setRepFirstName(data.firstName);
    setRepLastName(data.lastName);
    setRepDateOfBirth(data.dateOfBirth);
    setRepAddressStreet(data.street);
    setRepAddressCity(data.city);
    setRepAddressState(data.state);
    setRepAddressZip(data.zip);
  }

  const currentCountry = PHONE_COUNTRIES.find((c) => c.code === repPhoneCountryCode) ?? PHONE_COUNTRIES[0];
  const [showInvite, setShowInvite] = useState(false);

  const isValid =
    repFirstName.trim().length > 0 &&
    repLastName.trim().length > 0 &&
    repEmail.trim().length > 0 &&
    isControl &&
    repDateOfBirth.length > 0 &&
    repAddressStreet.trim().length > 0 &&
    repAddressCity.trim().length > 0 &&
    repAddressState.length > 0 &&
    repAddressZip.trim().length >= 5 &&
    repPhone.trim().length > 0 &&
    repSsnLast4.trim().length >= 9;

  const hasAny =
    repFirstName.trim().length > 0 ||
    repLastName.trim().length > 0 ||
    repEmail.trim().length > 0 ||
    repDateOfBirth.length > 0 ||
    repAddressStreet.trim().length > 0 ||
    repPhone.trim().length > 0 ||
    repSsnLast4.trim().length > 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      <OnboardingHeader onExit={() => console.log("Exit clicked")} />
      <div className="flex items-center justify-between px-8 pt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-hs-text-subtle hover:text-[#0091AE] transition-colors"
        >
          ← Back to application
        </button>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-1.5 text-sm text-hs-text-subtle hover:text-[#0091AE] transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1 13c0-2.761 2.239-5 5-5M11 10v4M13 12h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Invite someone
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 overflow-y-auto">
        <div className="flex flex-col gap-10 w-full max-w-2xl py-10">

          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-semibold text-hs-obsidian leading-tight">
              Business representative
            </h1>
            <p className="text-base text-hs-text-subtle">
              You may complete this on behalf of the company even if you are not a 25% owner — you just need the details for anyone who owns 25% or more.
            </p>
          </div>

          {/* ID upload */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={labelClass}>Quick fill from ID</span>
              <span className="text-xs bg-[#f0fafb] text-[#4ABACD] px-2 py-0.5 rounded-full font-medium">Optional</span>
            </div>
            <IdUploadCard onApply={applyIdData} />
          </div>

          {/* Identity */}
          <div className="flex flex-col gap-5">
            <SectionHeading title="Identity" subtitle="Must match government-issued ID" />

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Legal first name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={repFirstName}
                onChange={(e) => setRepFirstName(e.target.value)}
                placeholder="First name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Legal last name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={repLastName}
                onChange={(e) => setRepLastName(e.target.value)}
                placeholder="Last name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={repEmail}
                onChange={(e) => setRepEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isControl}
                onChange={(e) => setIsControl(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#4ABACD] focus:ring-[#4ABACD] flex-shrink-0 cursor-pointer"
              />
              <span className="text-sm text-hs-obsidian leading-snug">
                This business representative is an owner, executive, senior manager, or someone with significant managerial control within the company.{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Date of birth <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={repDateOfBirth}
                onChange={(e) => setRepDateOfBirth(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Home address */}
          <div className="flex flex-col gap-5">
            <SectionHeading title="Home address" subtitle="Personal residential address — not your business address" />

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Home address <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={repAddressStreet}
                onChange={(e) => setRepAddressStreet(e.target.value)}
                placeholder="Street address"
                className={inputClass}
              />
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Address line 2"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>City <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={repAddressCity}
                onChange={(e) => setRepAddressCity(e.target.value)}
                placeholder="City"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>State <span className="text-red-500">*</span></label>
              <select
                value={repAddressState}
                onChange={(e) => setRepAddressState(e.target.value)}
                className={`${inputClass} bg-white`}
              >
                <option value="">Select state</option>
                {US_STATE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Zip code <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={repAddressZip}
                onChange={(e) => setRepAddressZip(e.target.value)}
                placeholder="00000"
                maxLength={10}
                className={inputClass}
              />
            </div>
          </div>

          {/* Contact & identity verification */}
          <div className="flex flex-col gap-5">
            <SectionHeading title="Contact & verification" />

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Phone number <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <select
                  value={repPhoneCountryCode}
                  onChange={(e) => setRepPhoneCountryCode(e.target.value)}
                  className="px-3 py-3 rounded-lg border border-gray-200 bg-white text-sm text-hs-obsidian focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors flex-shrink-0"
                >
                  {PHONE_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={repPhone}
                  onChange={(e) => setRepPhone(e.target.value)}
                  placeholder="+1 (555) 555-5555"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Social Security number <span className="text-red-500">*</span></label>
              <p className="text-xs text-hs-text-subtle">Used for identity verification only — encrypted and never stored in plain text</p>
              <div className="relative">
                <input
                  type={showSsn ? "text" : "password"}
                  value={repSsnLast4}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 9);
                    setRepSsnLast4(cleaned);
                  }}
                  placeholder="000000000"
                  inputMode="numeric"
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowSsn(!showSsn)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors"
                >
                  {showSsn ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="pb-10 flex flex-col gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                isValid
                  ? "bg-[#141414] text-white hover:bg-[#2d2d2d] hover:shadow-md"
                  : hasAny
                    ? "bg-[#4ABACD] text-white hover:bg-[#0091AE] hover:shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {isValid ? "Save & return to application" : hasAny ? "Save progress" : "Return to application"}
            </button>
            {hasAny && !isValid && (
              <p className="text-xs text-hs-text-subtle text-center">Your progress is saved — you can return to complete this section anytime.</p>
            )}
          </div>

        </div>
      </div>

      {showInvite && (
        <InviteModal
          sectionTitle="Business representative"
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}
