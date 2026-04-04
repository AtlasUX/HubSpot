import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { InviteModal } from "@/components/InviteModal";

function ChipGroup({
  label,
  hint,
  options,
  value,
  onChange,
  required,
}: {
  label: string;
  hint?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <label className="text-sm font-semibold text-hs-obsidian">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {hint && <p className="text-xs text-hs-text-subtle">{hint}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                selected
                  ? "bg-[#4ABACD] border-[#4ABACD] text-white shadow-sm"
                  : "bg-white border-gray-200 text-hs-obsidian hover:border-[#4ABACD] hover:text-[#4ABACD]"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type StripeConnectState = "idle" | "connecting" | "done";

function BankConnectionCard({ onConnected }: { onConnected: () => void }) {
  const [state, setState] = useState<StripeConnectState>("idle");

  async function handleConnect() {
    setState("connecting");
    await new Promise((r) => setTimeout(r, 2000));
    setState("done");
    onConnected();
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <div className="w-8 h-8 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-0 flex-1">
          <span className="text-sm font-semibold text-hs-obsidian">Bank account connected</span>
          <span className="text-xs text-[#4ABACD]">Increases your chance of auto-approval</span>
        </div>
        <button onClick={() => setState("idle")} className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors flex-shrink-0">Change</button>
      </div>
    );
  }

  if (state === "connecting") {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-5 rounded-xl border border-gray-200 bg-gray-50">
        <div className="w-7 h-7 border-2 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-hs-text-subtle">Connecting via Stripe…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4 rounded-xl border border-[#4ABACD]/30 bg-[#f0fafb]">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-white border border-[#4ABACD]/30 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[#4ABACD]">
            <rect x="2" y="6" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M2 9h14M5 6V4.5a4 4 0 018 0V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-hs-obsidian">Connect your business bank account</span>
          <span className="text-xs text-hs-text-subtle">Businesses that connect are <span className="font-semibold text-[#4ABACD]">85% more likely</span> to be auto-approved instantly</span>
        </div>
      </div>
      <button
        onClick={handleConnect}
        className="w-full py-2.5 bg-[#635BFF] text-white rounded-lg text-sm font-semibold hover:bg-[#5249e3] transition-colors"
      >
        Connect with Stripe →
      </button>
      <p className="text-xs text-hs-text-subtle text-center">Secured by Stripe · Read-only access · Disconnect anytime</p>
    </div>
  );
}

const TIME_IN_BUSINESS_OPTIONS = [
  { label: "Less than 1 year", value: "less-than-1" },
  { label: "1–3 years", value: "1-3" },
  { label: "3–5 years", value: "3-5" },
  { label: "5–7 years", value: "5-7" },
  { label: "More than 7 years", value: "7-plus" },
];

const AVG_TRANSACTION_OPTIONS = [
  { label: "$1,000 or less", value: "0-1000" },
  { label: "$1,001–$2,500", value: "1001-2500" },
  { label: "$2,501–$5,000", value: "2501-5000" },
  { label: "$5,001–$7,500", value: "5001-7500" },
  { label: "$7,501–$10,000", value: "7501-10000" },
  { label: "$10,001 or more", value: "10001-plus" },
];

const MONTHLY_VOLUME_OPTIONS = [
  { label: "$50K or less", value: "0-50000" },
  { label: "$50K–$100K", value: "50001-100000" },
  { label: "$100K–$250K", value: "100001-250000" },
  { label: "$250K–$500K", value: "250001-500000" },
  { label: "$500K or more", value: "500001-plus" },
];

type IrsDocState = "idle" | "extracting" | "review" | "confirmed-manual" | "confirmed-irs";

const ENTITY_TYPE_MAP: Record<string, string> = {
  "sole-proprietorship": "Sole Proprietor",
  "single-member-llc": "Limited Liability Company",
  "multi-member-llc": "Limited Liability Company",
  "private-partnership": "Partnership",
  "private-corporation": "Corporation",
};

function formatEin(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

function IrsDocumentUploadCard({
  ein,
  setEin,
  businessStructure,
  legalBusinessName,
}: {
  ein: string;
  setEin: (v: string) => void;
  businessStructure: string | null;
  legalBusinessName: string;
}) {
  const [state, setState] = useState<IrsDocState>(ein ? "confirmed-manual" : "idle");
  const [inputEin, setInputEin] = useState(ein);
  const [extractedEin, setExtractedEin] = useState("");
  const [extractedEntityType, setExtractedEntityType] = useState("");
  const [extractedName, setExtractedName] = useState("");
  const [structureMismatch, setStructureMismatch] = useState(false);
  const [uploadExpanded, setUploadExpanded] = useState(false);

  const einValid = inputEin.replace(/\D/g, "").length === 9;

  async function handleUpload() {
    setState("extracting");
    await new Promise((r) => setTimeout(r, 2200));
    const simEntityType = businessStructure
      ? (ENTITY_TYPE_MAP[businessStructure] ?? "Other")
      : "Limited Liability Company";
    setExtractedEin("82-4721039");
    setExtractedEntityType(simEntityType);
    setExtractedName(legalBusinessName || "Acme LLC");
    setStructureMismatch(false);
    setState("review");
  }

  function handleIrsConfirm() {
    setEin(extractedEin);
    setInputEin(extractedEin);
    setState("confirmed-irs");
  }

  function handleManualSave() {
    if (einValid) {
      setEin(inputEin);
      setState("confirmed-manual");
    }
  }

  if (state === "confirmed-irs") {
    const masked = ein.length >= 4 ? `${ein.slice(0, 2)}-XXXXX${ein.slice(-2)}` : ein;
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <div className="w-8 h-8 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-0 flex-1">
          <span className="text-sm font-semibold text-hs-obsidian">EIN confirmed · {masked}</span>
          <span className="text-xs text-[#4ABACD]">Entity type verified from IRS letter</span>
        </div>
        <button onClick={() => { setState("idle"); setUploadExpanded(false); }} className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors flex-shrink-0">Change</button>
      </div>
    );
  }

  if (state === "confirmed-manual") {
    const masked = ein.length >= 4 ? `${ein.slice(0, 2)}-XXXXX${ein.slice(-2)}` : ein;
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <div className="w-8 h-8 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-0 flex-1">
          <span className="text-sm font-semibold text-hs-obsidian">EIN saved · {masked}</span>
        </div>
        <button onClick={() => { setState("idle"); setUploadExpanded(false); }} className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors flex-shrink-0">Change</button>
      </div>
    );
  }

  if (state === "extracting") {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-6 rounded-xl border border-gray-200 bg-gray-50">
        <div className="w-7 h-7 border-2 border-[#4ABACD] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-hs-text-subtle">Reading your IRS letter…</span>
      </div>
    );
  }

  if (state === "review") {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 rounded-xl border border-[#4ABACD]/30 bg-[#f0fafb]">
        <span className="text-sm font-semibold text-hs-obsidian">Extracted from your IRS letter — review and confirm</span>
        <div className="flex flex-col gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">Business name on IRS letter</span>
            <input type="text" value={extractedName} onChange={(e) => setExtractedName(e.target.value)} className="text-sm text-hs-obsidian bg-transparent border-b border-gray-200 focus:border-[#4ABACD] focus:outline-none py-1" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">EIN</span>
            <input type="text" value={extractedEin} onChange={(e) => setExtractedEin(formatEin(e.target.value))} className="text-sm text-hs-obsidian font-mono bg-transparent border-b border-gray-200 focus:border-[#4ABACD] focus:outline-none py-1" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">Entity type</span>
            <span className="text-sm text-hs-obsidian py-1">{extractedEntityType}</span>
          </div>
        </div>
        {structureMismatch && (
          <div className="flex gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <span className="flex-shrink-0">⚠</span>
            <span>The entity type on this document doesn't match your selected business structure. Please verify before confirming.</span>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={() => { setState("idle"); setUploadExpanded(true); }} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-hs-text-subtle hover:border-gray-300 transition-colors">Try again</button>
          <button onClick={handleIrsConfirm} className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-sm font-semibold hover:bg-[#2d2d2d] transition-colors">Confirm →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          value={inputEin}
          onChange={(e) => setInputEin(formatEin(e.target.value))}
          placeholder="XX-XXXXXXX"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian font-mono placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-hs-text-subtle">9 digits — found on your SS-4 or any IRS correspondence</span>
          {einValid && (
            <button onClick={handleManualSave} className="text-xs font-semibold text-[#4ABACD] hover:text-[#0091AE] transition-colors">Save →</button>
          )}
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setUploadExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-hs-text-subtle flex-shrink-0">
              <rect x="2.5" y="1.5" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5 5h5M5 8h5M5 11h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="text-sm text-hs-text-subtle">Upload IRS letter to auto-fill</span>
            <span className="text-xs text-[#4ABACD] font-medium bg-[#4ABACD]/10 px-1.5 py-0.5 rounded">Optional</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={`text-hs-text-subtle transition-transform duration-200 ${uploadExpanded ? "rotate-180" : ""}`}>
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {uploadExpanded && (
          <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
            <p className="text-xs text-hs-text-subtle pt-3">CP-575 or Letter 147C — auto-fills your EIN and confirms your legal entity type. Speeds up the review process.</p>
            <label className="w-full py-2.5 bg-white border border-gray-200 text-hs-obsidian rounded-lg text-sm font-medium hover:border-[#4ABACD] hover:text-[#4ABACD] transition-colors cursor-pointer text-center block">
              <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleUpload} />
              Choose file or take a photo
            </label>
            <p className="text-xs text-hs-text-subtle"><span className="font-medium text-hs-obsidian">Need your letter?</span>{" "}Call the IRS at 800-829-4933 — takes ~10 min, faxed or mailed same day</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusinessFinancials() {
  const navigate = useNavigate();
  const {
    timeInBusiness, setTimeInBusiness,
    averageTransactionAmount, setAverageTransactionAmount,
    monthlyTransactionVolume, setMonthlyTransactionVolume,
    ein, setEin,
    businessStructure,
    legalBusinessName,
    bankStatementDescription, setBankStatementDescription,
    doingBusinessAs,
    addInvite,
  } = useOnboarding();

  const [showDelegate, setShowDelegate] = useState(false);
  const [bankConnected, setBankConnected] = useState(false);

  const hasAny = ein.trim().length > 0 || timeInBusiness.length > 0 || averageTransactionAmount.length > 0 || monthlyTransactionVolume.length > 0 || bankStatementDescription.length > 0;
  const isValid =
    ein.trim().length > 0 &&
    timeInBusiness.length > 0 &&
    averageTransactionAmount.length > 0 &&
    monthlyTransactionVolume.length > 0 &&
    bankStatementDescription.trim().length >= 5 &&
    /[a-zA-Z]/.test(bankStatementDescription);

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
          onClick={() => setShowDelegate(true)}
          className="flex items-center gap-1.5 text-sm text-hs-text-subtle hover:text-[#0091AE] transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
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
              Tax & financials
            </h1>
            <p className="text-base text-hs-text-subtle">
              Used to verify your tax registration and assess processing limits — not shared with third parties.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-hs-obsidian">
                EIN (Employer Identification Number) <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-hs-text-subtle">
                Required for tax reporting (1099-K) — must match your IRS records exactly
              </p>
            </div>
            <IrsDocumentUploadCard
              ein={ein}
              setEin={setEin}
              businessStructure={businessStructure}
              legalBusinessName={legalBusinessName}
            />
          </div>

          <BankConnectionCard onConnected={() => setBankConnected(true)} />

          <ChipGroup
            label="How long has your business been operating?"
            options={TIME_IN_BUSINESS_OPTIONS}
            value={timeInBusiness}
            onChange={setTimeInBusiness}
            required
          />

          <ChipGroup
            label="Average transaction amount"
            hint="Typical single payment you collect from a customer"
            options={AVG_TRANSACTION_OPTIONS}
            value={averageTransactionAmount}
            onChange={setAverageTransactionAmount}
            required
          />

          <ChipGroup
            label="Monthly transaction volume"
            hint="Total revenue processed through HubSpot Payments per month"
            options={MONTHLY_VOLUME_OPTIONS}
            value={monthlyTransactionVolume}
            onChange={setMonthlyTransactionVolume}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-hs-obsidian">
              Bank statement description<span className="text-red-500 ml-0.5">*</span>
            </label>
            <p className="text-xs text-hs-text-subtle">
              What appears on your customers' bank statements. Use 5–22 characters with at least 1 letter.
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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
            />
            <div className="flex justify-between">
              <span className={`text-xs ${bankStatementDescription.length > 0 && bankStatementDescription.length < 5 ? "text-red-500" : "text-hs-text-subtle"}`}>
                {bankStatementDescription.length > 0 && bankStatementDescription.length < 5
                  ? `${5 - bankStatementDescription.length} more characters needed`
                  : "Customers will see this on their card statement"}
              </span>
              <span className="text-xs text-hs-text-subtle">{bankStatementDescription.length}/22</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pb-10">
            <button
              onClick={() => navigate("/dashboard")}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                isValid
                  ? "bg-[#141414] text-white hover:bg-[#2d2d2d] hover:shadow-md"
                  : hasAny
                  ? "bg-[#141414] text-white hover:bg-[#2d2d2d] opacity-80"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
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

      {showDelegate && (
        <InviteModal sectionTitle="Tax & financials" onClose={() => setShowDelegate(false)} onSend={addInvite} />
      )}
    </div>
  );
}
