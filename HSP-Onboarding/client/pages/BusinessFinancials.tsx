import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";

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

function DelegateModal({ section, onClose }: { section: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!email.trim()) return;
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-hs-obsidian">Invite someone to complete this</h2>
          <p className="text-sm text-hs-text-subtle mt-0.5">
            They'll get a secure link to fill out <span className="font-medium text-hs-obsidian">{section}</span> on your behalf.
          </p>
        </div>

        {sent ? (
          <div className="px-6 py-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f0fafb] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4ABACD" />
                <path d="M7 12l3.5 3.5L17 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-hs-obsidian">Link sent to {email}</p>
            <p className="text-xs text-hs-text-subtle">They'll receive a secure, one-time link. You'll be notified when they complete it.</p>
            <button onClick={onClose} className="mt-2 text-sm text-[#4ABACD] hover:underline">Done</button>
          </div>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Their email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="accountant@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Add a note <span className="font-normal text-hs-text-subtle">(optional)</span></label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Please fill out our monthly revenue and transaction info"
                rows={2}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-hs-obsidian placeholder-gray-300 resize-none focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-hs-text-subtle hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!email.trim()}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  email.trim()
                    ? "bg-[#141414] text-white hover:bg-[#2d2d2d]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Send invite →
              </button>
            </div>
          </div>
        )}
      </div>
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

export default function BusinessFinancials() {
  const navigate = useNavigate();
  const {
    timeInBusiness, setTimeInBusiness,
    averageTransactionAmount, setAverageTransactionAmount,
    monthlyTransactionVolume, setMonthlyTransactionVolume,
  } = useOnboarding();

  const [showDelegate, setShowDelegate] = useState(false);

  const isValid =
    timeInBusiness.length > 0 &&
    averageTransactionAmount.length > 0 &&
    monthlyTransactionVolume.length > 0;

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
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Invite someone
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 overflow-y-auto">
        <div className="flex flex-col gap-10 w-full max-w-2xl py-10">

          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-semibold text-hs-obsidian leading-tight">
              Financials
            </h1>
            <p className="text-base text-hs-text-subtle">
              Used to assess processing limits and detect unusual activity — not shared with third parties.
            </p>
          </div>

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

      {showDelegate && (
        <DelegateModal section="Financials" onClose={() => setShowDelegate(false)} />
      )}
    </div>
  );
}
