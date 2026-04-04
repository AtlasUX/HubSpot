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

type PlaidState = "idle" | "picking" | "connecting" | "done";

const BANKS = [
  { id: "chase", name: "Chase", color: "#117ACA" },
  { id: "bofa", name: "Bank of America", color: "#E11B22" },
  { id: "wells", name: "Wells Fargo", color: "#D71E28" },
  { id: "citi", name: "Citibank", color: "#003B70" },
  { id: "usbank", name: "U.S. Bank", color: "#0C2C8A" },
  { id: "pnc", name: "PNC Bank", color: "#F58220" },
];

function BankConnectionCard({ onConnected }: { onConnected: () => void }) {
  const [state, setState] = useState<PlaidState>("idle");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  async function handleBankSelect(bankId: string) {
    setSelectedBank(bankId);
    setState("connecting");
    await new Promise((r) => setTimeout(r, 2000));
    setState("done");
    onConnected();
  }

  if (state === "done") {
    const bank = BANKS.find((b) => b.id === selectedBank);
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <div className="w-8 h-8 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-0">
          <span className="text-sm font-semibold text-hs-obsidian">{bank?.name} connected</span>
          <span className="text-xs text-[#4ABACD]">Increases your chance of auto-approval</span>
        </div>
      </div>
    );
  }

  if (state === "connecting") {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-5 rounded-xl border border-gray-200 bg-gray-50">
        <div className="w-7 h-7 border-2 border-[#4ABACD] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-hs-text-subtle">Connecting securely…</span>
      </div>
    );
  }

  if (state === "picking") {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 pt-4">
          <p className="text-sm font-semibold text-hs-obsidian">Select your bank</p>
        </div>
        <div className="grid grid-cols-3 gap-px bg-gray-100">
          {BANKS.map((bank) => (
            <button
              key={bank.id}
              onClick={() => handleBankSelect(bank.id)}
              className="flex flex-col items-center justify-center gap-1.5 px-3 py-3 bg-white hover:bg-[#f0fafb] transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: bank.color }}>
                {bank.name[0]}
              </div>
              <span className="text-xs text-hs-text-subtle text-center leading-tight">{bank.name}</span>
            </button>
          ))}
        </div>
        <div className="px-4 pb-3">
          <button onClick={() => setState("idle")} className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors">Cancel</button>
        </div>
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
        onClick={() => setState("picking")}
        className="w-full py-2.5 bg-[#4ABACD] text-white rounded-lg text-sm font-semibold hover:bg-[#3aa8bb] transition-colors"
      >
        Connect bank account →
      </button>
      <p className="text-xs text-hs-text-subtle text-center">Powered by Plaid · Read-only access · Disconnect anytime</p>
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
  const [bankConnected, setBankConnected] = useState(false);

  const hasAny = timeInBusiness.length > 0 || averageTransactionAmount.length > 0 || monthlyTransactionVolume.length > 0;
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
              Financials
            </h1>
            <p className="text-base text-hs-text-subtle">
              Used to assess processing limits and detect unusual activity — not shared with third parties.
            </p>
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

          <div className="flex flex-col gap-3 pb-10">
            <button
              onClick={() => navigate("/dashboard")}
              disabled={!isValid && !hasAny}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                isValid
                  ? "bg-[#141414] text-white hover:bg-[#2d2d2d] hover:shadow-md"
                  : hasAny
                    ? "bg-[#141414] text-white hover:bg-[#2d2d2d] hover:shadow-md opacity-80"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isValid ? "Save & return to application" : hasAny ? "Save progress & return" : "Save & return to application"}
            </button>
            {hasAny && !isValid && (
              <p className="text-xs text-hs-text-subtle text-center">Your progress is saved — finish the remaining fields to complete this section</p>
            )}
          </div>

        </div>
      </div>

      {showDelegate && (
        <DelegateModal section="Financials" onClose={() => setShowDelegate(false)} />
      )}
    </div>
  );
}
