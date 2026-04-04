import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { INDUSTRIES, getDescriptionRestriction, type Industry } from "@/data/industries";

interface BusinessRegistryResult {
  name: string;
  state: string;
  type: string;
  status: string;
}

const SIMULATED_REGISTRY: BusinessRegistryResult[] = [
  { name: "Acme Corporation LLC", state: "Delaware", type: "LLC", status: "Active" },
  { name: "Acme Consulting Group Inc", state: "California", type: "Corporation", status: "Active" },
  { name: "Acme Digital Solutions LLC", state: "Texas", type: "LLC", status: "Active" },
  { name: "Atlas Creative Studio LLC", state: "New York", type: "LLC", status: "Active" },
  { name: "Atlas Technologies Inc", state: "Delaware", type: "Corporation", status: "Active" },
  { name: "Blue Ridge Services LLC", state: "Virginia", type: "LLC", status: "Active" },
  { name: "Bright Path Consulting LLC", state: "Georgia", type: "LLC", status: "Active" },
  { name: "Cedar Grove Industries Inc", state: "Ohio", type: "Corporation", status: "Active" },
  { name: "Coastal Media Group LLC", state: "Florida", type: "LLC", status: "Active" },
  { name: "Diamond Peak Solutions Inc", state: "Colorado", type: "Corporation", status: "Active" },
  { name: "Elevate Marketing LLC", state: "California", type: "LLC", status: "Active" },
  { name: "Frontier Tech Ventures LLC", state: "Texas", type: "LLC", status: "Active" },
  { name: "Global Bridge Partners Inc", state: "New York", type: "Corporation", status: "Active" },
  { name: "Harbor Digital LLC", state: "Washington", type: "LLC", status: "Active" },
  { name: "Ironwood Creative LLC", state: "Illinois", type: "LLC", status: "Active" },
];

function getRegistryResults(query: string): BusinessRegistryResult[] {
  const q = query.toLowerCase();
  return SIMULATED_REGISTRY
    .filter((b) => b.name.toLowerCase().includes(q))
    .slice(0, 5);
}

type IrsDocState = "idle" | "extracting" | "review" | "confirmed" | "manual";

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
  const [state, setState] = useState<IrsDocState>(ein ? "confirmed" : "idle");
  const [extractedEin, setExtractedEin] = useState("");
  const [extractedEntityType, setExtractedEntityType] = useState("");
  const [extractedName, setExtractedName] = useState("");
  const [manualEin, setManualEin] = useState(ein);
  const [structureMismatch, setStructureMismatch] = useState(false);

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

  function handleConfirm() {
    setEin(extractedEin);
    setState("confirmed");
  }

  function handleManualSave() {
    if (manualEin.replace(/\D/g, "").length === 9) {
      setEin(manualEin);
      setState("confirmed");
    }
  }

  if (state === "confirmed") {
    const masked = ein.length >= 4
      ? `${ein.slice(0, 2)}-XXXXX${ein.slice(-2)}`
      : ein;
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <div className="w-8 h-8 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-0 flex-1">
          <span className="text-sm font-semibold text-hs-obsidian">EIN verified · {masked}</span>
          <span className="text-xs text-[#4ABACD]">Business structure confirmed from IRS letter</span>
        </div>
        <button
          onClick={() => setState("idle")}
          className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors flex-shrink-0"
        >
          Replace
        </button>
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
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#4ABACD] flex-shrink-0">
            <path d="M3 4h10M3 8h10M3 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-semibold text-hs-obsidian">Extracted from your IRS letter — review and confirm</span>
        </div>

        <div className="flex flex-col gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">Business name on IRS letter</span>
            <input
              type="text"
              value={extractedName}
              onChange={(e) => setExtractedName(e.target.value)}
              className="text-sm text-hs-obsidian bg-transparent border-b border-gray-200 focus:border-[#4ABACD] focus:outline-none py-1"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">EIN</span>
            <input
              type="text"
              value={extractedEin}
              onChange={(e) => setExtractedEin(formatEin(e.target.value))}
              className="text-sm text-hs-obsidian font-mono bg-transparent border-b border-gray-200 focus:border-[#4ABACD] focus:outline-none py-1"
            />
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
          <button
            onClick={() => setState("idle")}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-hs-text-subtle hover:border-gray-300 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-sm font-semibold hover:bg-[#2d2d2d] transition-colors"
          >
            Confirm →
          </button>
        </div>
      </div>
    );
  }

  if (state === "manual") {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-hs-obsidian">Enter EIN manually</span>
          <button
            onClick={() => setState("idle")}
            className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors"
          >
            Upload document instead
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            type="text"
            value={manualEin}
            onChange={(e) => setManualEin(formatEin(e.target.value))}
            placeholder="XX-XXXXXXX"
            autoFocus
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian font-mono placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
          />
          <p className="text-xs text-hs-text-subtle">We won't be able to auto-verify your entity type — underwriting may request your IRS letter after submission.</p>
        </div>
        <button
          onClick={handleManualSave}
          disabled={manualEin.replace(/\D/g, "").length !== 9}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            manualEin.replace(/\D/g, "").length === 9
              ? "bg-[#141414] text-white hover:bg-[#2d2d2d]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save EIN
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4 rounded-xl border border-[#4ABACD]/30 bg-[#f0fafb]">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-white border border-[#4ABACD]/30 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-[#4ABACD]">
            <rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-hs-obsidian">Upload your IRS EIN Confirmation Letter</span>
          <span className="text-xs text-hs-text-subtle">CP-575 or Letter 147C — confirms your EIN <span className="font-medium text-hs-obsidian">and</span> legal entity type in one step, reducing underwriting delays</span>
        </div>
      </div>

      <label className="w-full py-2.5 bg-[#4ABACD] text-white rounded-lg text-sm font-semibold hover:bg-[#3aa8bb] transition-colors cursor-pointer text-center block">
        <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleUpload} />
        Upload or take a photo →
      </label>

      <div className="flex items-center gap-2 text-xs text-hs-text-subtle">
        <span className="flex-1 h-px bg-gray-200" />
        <span>Don't have it?</span>
        <span className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex flex-col gap-1.5 text-xs text-hs-text-subtle">
        <p>
          <span className="font-semibold text-hs-obsidian">Get a 147C letter:</span>{" "}
          Call the IRS at <span className="font-medium text-hs-obsidian">800-829-4933</span> — takes ~10 min, delivered by fax or mail same day
        </p>
        <button
          onClick={() => setState("manual")}
          className="text-left text-[#0091AE] hover:underline"
        >
          Enter EIN manually instead (may slow approval) →
        </button>
      </div>
    </div>
  );
}

export default function BusinessInformation() {
  const navigate = useNavigate();
  const {
    legalBusinessName, setLegalBusinessName,
    doingBusinessAs, setDoingBusinessAs,
    industry, setIndustry,
    productsOrServices, setProductsOrServices,
    ein, setEin,
    businessStructure,
  } = useOnboarding();

  const [search, setSearch] = useState("");
  const [registryResults, setRegistryResults] = useState<BusinessRegistryResult[]>([]);
  const [showRegistry, setShowRegistry] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const registryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (legalBusinessName.length >= 3 && nameFocused) {
      const results = getRegistryResults(legalBusinessName);
      setRegistryResults(results);
      setShowRegistry(results.length > 0);
    } else {
      setShowRegistry(false);
    }
  }, [legalBusinessName, nameFocused]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (registryRef.current && !registryRef.current.contains(e.target as Node)) {
        setShowRegistry(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedIndustry: Industry | null = INDUSTRIES.find((i) => i.value === industry) ?? null;

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filtered = q
      ? INDUSTRIES.filter(
          (i) =>
            i.label.toLowerCase().includes(q) ||
            i.group.toLowerCase().includes(q) ||
            (i.irsCode && i.irsCode.includes(q))
        )
      : INDUSTRIES;

    const groups: Record<string, Industry[]> = {};
    for (const item of filtered) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    }
    return groups;
  }, [search]);

  const descriptionRestriction =
    productsOrServices.trim().length >= 10
      ? getDescriptionRestriction(productsOrServices)
      : null;

  const isProhibited =
    selectedIndustry?.restriction === "prohibited" ||
    descriptionRestriction?.status === "prohibited";

  const isValid =
    legalBusinessName.trim().length > 0 &&
    ein.trim().length > 0 &&
    industry.length > 0 &&
    productsOrServices.trim().length >= 10 &&
    !isProhibited;

  const handleIndustrySelect = (value: string) => {
    setIndustry(value);
    setSearch("");
  };

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
        <div className="flex flex-col gap-8 w-full max-w-2xl py-10">

          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-semibold text-hs-obsidian leading-tight">
              Tell us about your business
            </h1>
            <p className="text-base text-hs-text-subtle">
              We use this to verify your business and ensure compliance with payment network rules.
            </p>
          </div>

          {/* Trust banner */}
          <div className="flex gap-3 px-4 py-4 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5 text-[#4ABACD]">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 8v5M9 6h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-hs-obsidian">Most applications are approved automatically in minutes</span>
              <span className="text-sm text-hs-text-subtle">If we need anything else, our underwriting team will reach out within 1 business day of submission — no waiting around.</span>
            </div>
          </div>

          {/* Legal business name */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-hs-obsidian">
                Legal business name <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-hs-text-subtle">
                The exact name on your government registration documents
              </p>
            </div>
            <div className="relative" ref={registryRef}>
              <input
                type="text"
                value={legalBusinessName}
                onChange={(e) => setLegalBusinessName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                placeholder="e.g. Acme Corporation LLC"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
                autoComplete="off"
              />
              {showRegistry && (
                <div className="absolute z-20 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                  {registryResults.map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={() => {
                        setLegalBusinessName(b.name);
                        setShowRegistry(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-[#f0fafb] transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-hs-obsidian">{b.name}</span>
                        <span className="text-xs text-hs-text-subtle">{b.state} · {b.type}</span>
                      </div>
                      <span className="text-xs text-[#4ABACD] font-medium ml-3 flex-shrink-0">{b.status}</span>
                    </button>
                  ))}
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <span className="text-xs text-hs-text-subtle">Results from public business registry</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DBA */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-hs-obsidian">
                Doing business as (DBA)
              </label>
              <p className="text-xs text-hs-text-subtle">
                The operating name customers see, if different from your legal name
              </p>
            </div>
            <input
              type="text"
              value={doingBusinessAs}
              onChange={(e) => setDoingBusinessAs(e.target.value)}
              placeholder="e.g. Acme Consulting"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
            />
          </div>

          {/* EIN + business structure verification */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-hs-obsidian">
                EIN & business structure <span className="text-red-500">*</span>
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

          {/* Industry */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-hs-obsidian">
                Industry <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-hs-text-subtle">
                Select the category that best describes what your business does
              </p>
            </div>

            {selectedIndustry ? (
              <div className="flex flex-col gap-2">
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 ${
                    selectedIndustry.restriction === "prohibited"
                      ? "border-red-300 bg-red-50"
                      : selectedIndustry.restriction === "restricted"
                      ? "border-amber-300 bg-amber-50"
                      : "border-[#4ABACD] bg-[#f0fafb]"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-hs-obsidian">
                      {selectedIndustry.label}
                    </span>
                    <span className="text-xs text-hs-text-subtle">
                      {selectedIndustry.group}
                      {selectedIndustry.irsCode && ` · IRS ${selectedIndustry.irsCode}`}
                    </span>
                  </div>
                  <button
                    onClick={() => setIndustry("")}
                    className="text-xs text-hs-text-subtle hover:text-[#0091AE] ml-4 flex-shrink-0 transition-colors"
                  >
                    Change
                  </button>
                </div>

                {selectedIndustry.restriction === "prohibited" && (
                  <div className="flex gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                    <span className="text-red-500 flex-shrink-0 font-bold">⊘</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-red-700">
                        Not eligible for HubSpot Payments
                      </span>
                      <span className="text-sm text-red-600">
                        {selectedIndustry.restrictionReason}
                      </span>
                      <a
                        href="#"
                        className="text-sm text-red-600 underline mt-0.5 hover:text-red-800"
                      >
                        Learn about alternative payment options →
                      </a>
                    </div>
                  </div>
                )}

                {selectedIndustry.restriction === "restricted" && (
                  <div className="flex gap-3 px-4 py-4 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-amber-700">
                          Requires prior approval — you can still apply
                        </span>
                        <span className="text-sm text-amber-600">
                          {selectedIndustry.restrictionReason} Our team will review and respond within 1 business day.
                        </span>
                      </div>
                      {selectedIndustry.approvalRequirements && selectedIndustry.approvalRequirements.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">You'll need to provide:</span>
                          <ul className="flex flex-col gap-1">
                            {selectedIndustry.approvalRequirements.map((req) => (
                              <li key={req} className="flex items-start gap-2 text-sm text-amber-700">
                                <span className="flex-shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                                {req}
                              </li>
                            ))}
                          </ul>
                          <span className="text-xs text-amber-600 mt-0.5">Have these ready — underwriting may request them after submission.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search industries…"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-400 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
                  />
                </div>

                <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200">
                  {Object.entries(filteredGroups).length === 0 ? (
                    <div className="px-4 py-8 text-sm text-hs-text-subtle text-center">
                      No industries match &ldquo;{search}&rdquo;
                    </div>
                  ) : (
                    Object.entries(filteredGroups).map(([group, items]) => (
                      <div key={group}>
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                          <span className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide">
                            {group}
                          </span>
                        </div>
                        {items.map((item) => (
                          <button
                            key={item.value}
                            onClick={() => handleIndustrySelect(item.value)}
                            className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-[#f0fafb] transition-colors border-b border-gray-50 last:border-0"
                          >
                            <span className="text-sm text-hs-obsidian">{item.label}</span>
                            {item.restriction === "prohibited" && (
                              <span className="text-xs text-red-500 font-medium ml-3 flex-shrink-0">
                                Not eligible
                              </span>
                            )}
                            {item.restriction === "restricted" && (
                              <span className="text-xs text-amber-500 font-medium ml-3 flex-shrink-0">
                                Needs approval
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
                <p className="text-xs text-hs-text-subtle">
                  Some industries require prior approval or are not eligible — these are marked in the list.
                </p>
              </div>
            )}
          </div>

          {/* Products / services */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-hs-obsidian">
                What will you collect payments for? <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-hs-text-subtle">
                Briefly describe the products or services your customers pay you for
              </p>
            </div>
            <textarea
              value={productsOrServices}
              onChange={(e) => setProductsOrServices(e.target.value)}
              placeholder="e.g. Website design and development services for small businesses"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-300 resize-none focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
            />
            <span
              className={`text-xs ${
                productsOrServices.trim().length > 0 && productsOrServices.trim().length < 10
                  ? "text-red-500"
                  : productsOrServices.trim().length >= 10
                  ? "text-[#4ABACD]"
                  : "text-hs-text-subtle"
              }`}
            >
              {productsOrServices.trim().length === 0
                ? "Minimum 10 characters"
                : productsOrServices.trim().length < 10
                ? `${10 - productsOrServices.trim().length} more characters needed`
                : "✓ Looks good"}
            </span>

            {descriptionRestriction?.status === "prohibited" && (
              <div className="flex gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                <span className="text-red-500 flex-shrink-0 font-bold">⊘</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-red-700">
                    Not eligible for HubSpot Payments
                  </span>
                  <span className="text-sm text-red-600">{descriptionRestriction.reason}</span>
                </div>
              </div>
            )}

            {descriptionRestriction?.status === "restricted" && (
              <div className="flex gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-amber-500 flex-shrink-0">⚠</span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-amber-700">
                    May require prior approval
                  </span>
                  <span className="text-sm text-amber-600">{descriptionRestriction.reason}</span>
                </div>
              </div>
            )}
          </div>

          {/* Save */}
          <div className="flex flex-col gap-3 pt-2 pb-10">
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
            {isProhibited && (
              <p className="text-xs text-red-600 text-center">
                Resolve the eligibility issue above before continuing.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
