import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding, type BusinessStructureOption } from "@/contexts/OnboardingContext";
import { INDUSTRIES, getDescriptionRestriction, type Industry } from "@/data/industries";
import { InviteModal } from "@/components/InviteModal";

const BUSINESS_TYPES = [
  { value: "individual" as const, label: "Individual", sub: "Freelancer, sole prop, or single-member LLC", taxNote: "1099K & taxes under your SSN", taxWarn: true, emoji: "👤" },
  { value: "company" as const, label: "Registered business", sub: "Multi-member LLC, corporation, or partnership", taxNote: "1099K & taxes under your EIN", taxWarn: false, emoji: "🏢" },
  { value: "nonprofit" as const, label: "Nonprofit", sub: "Registered charity or foundation", taxNote: "Tax-exempt entity", taxWarn: false, emoji: "💙" },
];

const STRUCTURES: { value: BusinessStructureOption; label: string; sub: string; taxNote?: string; taxNoteWarning?: boolean }[] = [
  { value: "sole-proprietorship", label: "Sole proprietorship", sub: "Unregistered individual business", taxNote: "1099K reports under your personal SSN", taxNoteWarning: true },
  { value: "single-member-llc", label: "Single-member LLC", sub: "One owner, registered as an LLC", taxNote: "1099K reports under your personal SSN", taxNoteWarning: true },
  { value: "multi-member-llc", label: "Multi-member LLC", sub: "Multiple owners, registered as an LLC", taxNote: "Tax reporting uses your business EIN" },
  { value: "private-partnership", label: "Private partnership", sub: "Two or more partners sharing ownership", taxNote: "Tax reporting uses your business EIN" },
  { value: "private-corporation", label: "Private corporation", sub: "C-Corp, S-Corp, or private corporation", taxNote: "Tax reporting uses your business EIN" },
];

function inferStructure(name: string): BusinessStructureOption | null {
  const n = name.toLowerCase();
  if (/\b(inc\.?|incorporated|corp\.?|corporation)\b/.test(n)) return "private-corporation";
  if (/\b(l\.?l\.?p\.?|limited partnership|& partners|and partners)\b/.test(n)) return "private-partnership";
  if (/\b(l\.?l\.?c\.?|limited liability)\b/.test(n)) return "multi-member-llc";
  return null;
}

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

interface MiddeskResult {
  legalName: string;
  ein: string;
  entityType: string;
  formationState: string;
  status: string;
  address: string;
}

const MIDDESK_RECORDS: Array<{ test: (n: string) => boolean; result: MiddeskResult }> = [
  { test: (n) => /acme/i.test(n), result: { legalName: "Acme Corporation LLC", ein: "47-2831094", entityType: "LLC", formationState: "Delaware", status: "Active", address: "1209 Orange St, Wilmington, DE 19801" } },
  { test: (n) => /atlas/i.test(n), result: { legalName: "Atlas Technologies Inc", ein: "83-1927463", entityType: "Corporation", formationState: "New York", status: "Active", address: "100 Park Ave, New York, NY 10017" } },
  { test: (n) => /blue ridge/i.test(n), result: { legalName: "Blue Ridge Services LLC", ein: "61-4823719", entityType: "LLC", formationState: "Virginia", status: "Active", address: "421 Main St, Roanoke, VA 24001" } },
  { test: (n) => /harbor/i.test(n), result: { legalName: "Harbor Digital LLC", ein: "92-3847261", entityType: "LLC", formationState: "Washington", status: "Active", address: "1100 Eastlake Ave E, Seattle, WA 98109" } },
  { test: (n) => /elevate/i.test(n), result: { legalName: "Elevate Marketing LLC", ein: "46-2937481", entityType: "LLC", formationState: "California", status: "Active", address: "456 Market St, San Francisco, CA 94105" } },
  { test: (n) => /ironwood/i.test(n), result: { legalName: "Ironwood Creative LLC", ein: "37-4928163", entityType: "LLC", formationState: "Illinois", status: "Active", address: "200 N Michigan Ave, Chicago, IL 60601" } },
  { test: (n) => /cedar/i.test(n), result: { legalName: "Cedar Grove Industries Inc", ein: "34-8273619", entityType: "Corporation", formationState: "Ohio", status: "Active", address: "350 E Broad St, Columbus, OH 43215" } },
];

type MiddeskState = "idle" | "searching" | "found" | "not-found" | "confirmed" | "skipped";

function formatEin(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

function MiddeskEinSection({
  ein, setEin, businessName, businessStructure, legalBusinessName,
}: {
  ein: string; setEin: (v: string) => void; businessName: string;
  businessStructure: string | null; legalBusinessName: string;
}) {
  const [middeskState, setMiddeskState] = useState<MiddeskState>(ein ? "confirmed" : "idle");
  const [middeskResult, setMiddeskResult] = useState<MiddeskResult | null>(null);
  const [confirmedFromMiddesk, setConfirmedFromMiddesk] = useState(false);
  const [manualEin, setManualEin] = useState("");
  const [uploadAccordionOpen, setUploadAccordionOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevBusinessName = useRef(businessName);

  useEffect(() => {
    if (middeskState === "confirmed") return;
    if (businessName === prevBusinessName.current && middeskState !== "idle") return;
    prevBusinessName.current = businessName;

    if (businessName.length < 4) {
      if (middeskState === "searching") setMiddeskState("idle");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setMiddeskState("searching");
      await new Promise((r) => setTimeout(r, 1800));
      const match = MIDDESK_RECORDS.find((rec) => rec.test(businessName));
      if (match) {
        setMiddeskResult(match);
        setMiddeskState("found");
      } else {
        setMiddeskState("not-found");
      }
    }, 1200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [businessName]);

  function handleUseThis() {
    if (!middeskResult) return;
    setEin(middeskResult.ein);
    setConfirmedFromMiddesk(true);
    setMiddeskState("confirmed");
  }

  function handleChange() {
    if (middeskResult) {
      setMiddeskState("found");
    } else {
      setMiddeskState("not-found");
    }
  }

  function handleManualSave() {
    if (manualEin.replace(/\D/g, "").length === 9) {
      setEin(manualEin);
      setConfirmedFromMiddesk(false);
      setMiddeskState("confirmed");
    }
  }

  async function handleFileUpload() {
    setIsExtracting(true);
    await new Promise((r) => setTimeout(r, 2200));
    setIsExtracting(false);
    setEin("82-4721039");
    setConfirmedFromMiddesk(false);
    setMiddeskState("confirmed");
  }

  if (middeskState === "idle") {
    return null;
  }

  if (middeskState === "searching") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
        <div className="w-4 h-4 border-2 border-[#4ABACD] border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span className="text-sm text-hs-text-subtle">Verifying business registration…</span>
      </div>
    );
  }

  if (middeskState === "found" && middeskResult) {
    const maskedEin = middeskResult.ein.length >= 4
      ? `XX-XXXXX${middeskResult.ein.slice(-2)}`
      : middeskResult.ein;
    return (
      <div className="flex flex-col gap-3 px-4 py-4 rounded-xl border border-[#4ABACD]/40 bg-[#f0fafb]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-hs-obsidian">Business found — confirm to auto-fill</span>
          <span className="text-xs text-[#4ABACD] font-medium">via Middesk</span>
        </div>
        <div className="flex flex-col gap-2 bg-white rounded-lg px-4 py-3 border border-gray-100">
          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">Legal name</span>
            <span className="text-sm text-hs-obsidian">{middeskResult.legalName}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">EIN</span>
            <span className="text-sm text-hs-obsidian font-mono">{maskedEin}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">Entity type</span>
            <span className="text-sm text-hs-obsidian">{middeskResult.entityType}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">Formed in</span>
            <span className="text-sm text-hs-obsidian">{middeskResult.formationState}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-gray-50">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">Address</span>
            <span className="text-sm text-hs-obsidian text-right max-w-[60%]">{middeskResult.address}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-hs-text-subtle font-semibold uppercase tracking-wide">Status</span>
            <span className="flex items-center gap-1.5 text-sm text-hs-obsidian">
              <span className="w-2 h-2 rounded-full bg-[#4ABACD] inline-block" />
              {middeskResult.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setMiddeskState("skipped")}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-hs-text-subtle hover:border-gray-300 transition-colors"
          >
            That's not right
          </button>
          <button
            onClick={handleUseThis}
            className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-sm font-semibold hover:bg-[#2d2d2d] transition-colors"
          >
            Use this →
          </button>
        </div>
      </div>
    );
  }

  if (middeskState === "confirmed") {
    const maskedEin = ein.length >= 4
      ? `XX-XXXXX${ein.slice(-2)}`
      : ein;
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <div className="w-8 h-8 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-sm font-semibold text-hs-obsidian">EIN confirmed · {maskedEin}</span>
          {confirmedFromMiddesk && middeskResult ? (
            <span className="text-xs text-[#4ABACD]">Verified via Middesk · {middeskResult.formationState} {middeskResult.entityType}</span>
          ) : (
            <span className="text-xs text-[#4ABACD]">Entered manually</span>
          )}
        </div>
        <button
          onClick={handleChange}
          className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors flex-shrink-0"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {middeskState === "not-found" && (
        <p className="text-xs text-hs-text-subtle">We couldn't find this business in public registries. You can enter your EIN manually below.</p>
      )}
      <div className="flex flex-col gap-1.5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={manualEin}
            onChange={(e) => setManualEin(formatEin(e.target.value))}
            placeholder="XX-XXXXXXX"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian font-mono placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
          />
          {manualEin.replace(/\D/g, "").length === 9 && (
            <button
              onClick={handleManualSave}
              className="absolute right-3 text-xs font-semibold text-[#4ABACD] hover:text-[#0091AE] transition-colors"
            >
              Save →
            </button>
          )}
        </div>
        <p className="text-xs text-hs-text-subtle">9 digits — found on your SS-4 or any IRS correspondence</p>
      </div>

      <div className="flex flex-col gap-0">
        <button
          onClick={() => setUploadAccordionOpen((v) => !v)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-200 text-left hover:border-gray-300 transition-colors"
        >
          <span className="text-sm text-hs-obsidian">Upload IRS letter to auto-fill</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#4ABACD] font-medium px-2 py-0.5 rounded-full bg-[#f0fafb] border border-[#4ABACD]/30">Optional</span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={`text-hs-text-subtle transition-transform ${uploadAccordionOpen ? "rotate-180" : ""}`}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
        {uploadAccordionOpen && (
          <div className="px-4 py-4 border border-t-0 border-gray-200 rounded-b-lg">
            {isExtracting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#4ABACD] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="text-sm text-hs-text-subtle">Extracting EIN from document…</span>
              </div>
            ) : (
              <label className="w-full py-2.5 bg-[#4ABACD] text-white rounded-lg text-sm font-semibold hover:bg-[#3aa8bb] transition-colors cursor-pointer text-center block">
                <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleFileUpload} />
                Choose file →
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusinessInformation() {
  const navigate = useNavigate();
  const {
    selectedBusinessType, setSelectedBusinessType,
    businessStructure, setBusinessStructure,
    setHasConfirmedBusinessType,
    legalBusinessName, setLegalBusinessName,
    doingBusinessAs, setDoingBusinessAs,
    industry, setIndustry,
    productsOrServices, setProductsOrServices,
    ein, setEin,
  } = useOnboarding();

  const { addInvite } = useOnboarding();
  const [showInvite, setShowInvite] = useState(false);
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

  const typeComplete = selectedBusinessType !== null && (selectedBusinessType !== "company" || businessStructure !== null);

  const isComplete =
    typeComplete &&
    legalBusinessName.trim().length > 0 &&
    ein.trim().length > 0 &&
    industry.length > 0 &&
    productsOrServices.trim().length >= 10 &&
    !isProhibited;

  const hasAny = selectedBusinessType !== null || legalBusinessName.trim().length > 0 || ein.trim().length > 0 || industry.length > 0 || productsOrServices.trim().length > 0;

  const handleIndustrySelect = (value: string) => {
    setIndustry(value);
    setSearch("");
  };

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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-hs-text-subtle hover:border-[#4ABACD] hover:text-[#4ABACD] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <circle cx="6" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
            <path d="M1 13c0-2.761 2.239-5 5-5M11 10v4M13 12h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Invite someone
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

          {/* Business type */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-hs-obsidian">Business type <span className="text-red-500">*</span></label>

            <div className="flex flex-col gap-2">
              {BUSINESS_TYPES.map(({ value, label, sub, taxNote, taxWarn, emoji }) => (
                <div key={value}>
                  <button
                    onClick={() => {
                      setSelectedBusinessType(value);
                      setHasConfirmedBusinessType(value !== "company");
                      if (value !== "company") setBusinessStructure(null);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 active:scale-[0.99]
                      ${selectedBusinessType === value
                        ? "border-[#4ABACD] bg-[#f0fafb]"
                        : "border-gray-200 bg-white hover:border-[#4ABACD] hover:bg-[#f0fafb]"
                      }`}
                  >
                    <span className="text-xl flex-shrink-0">{emoji}</span>
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="text-sm font-semibold text-hs-obsidian">{label}</span>
                      <span className="text-xs text-hs-text-subtle">{sub}</span>
                      <span className={`text-xs ${taxWarn ? "text-amber-600" : "text-[#4ABACD]"}`}>
                        {taxWarn ? "⚠ " : "✓ "}{taxNote}
                      </span>
                    </div>
                    {selectedBusinessType === value && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#4ABACD] flex-shrink-0">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  {/* Structure options expand directly under Registered business, before Nonprofit */}
                  {value === "company" && selectedBusinessType === "company" && (
                    <div className="mt-1 ml-4 pl-3 border-l-2 border-[#4ABACD]/30 flex flex-col gap-1.5 pt-1.5 pb-0.5">
                      <p className="text-xs font-medium text-hs-text-subtle uppercase tracking-wide">What's your structure?</p>
                      <div className="grid grid-cols-2 gap-2">
                        {STRUCTURES.map((s) => {
                          const isInferred = inferStructure(legalBusinessName) === s.value && legalBusinessName.trim().length > 0;
                          const isSelected = businessStructure === s.value;
                          return (
                            <button
                              key={s.value}
                              onClick={() => { setBusinessStructure(s.value); setHasConfirmedBusinessType(true); }}
                              className={`flex flex-col gap-1 px-3 py-2.5 rounded-lg border-2 text-left transition-all duration-150
                                ${isSelected
                                  ? "border-[#4ABACD] bg-[#f0fafb]"
                                  : "border-gray-200 bg-white hover:border-[#4ABACD] hover:bg-[#f0fafb]"
                                }`}
                            >
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold text-hs-obsidian">{s.label}</span>
                                {isInferred && <span className="text-[10px] text-[#4ABACD] font-medium">✦ Matches</span>}
                              </div>
                              {s.taxNote && (
                                <span className={`text-[10px] leading-tight ${s.taxNoteWarning ? "text-amber-600" : "text-[#4ABACD]"}`}>
                                  {s.taxNoteWarning ? "⚠ " : "✓ "}{s.taxNote}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legal business name + inline Middesk verification */}
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
            <MiddeskEinSection
              ein={ein}
              setEin={setEin}
              businessName={legalBusinessName}
              businessStructure={businessStructure}
              legalBusinessName={legalBusinessName}
            />
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
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                isComplete
                  ? "bg-[#141414] text-white hover:bg-[#2d2d2d] hover:shadow-md"
                  : hasAny
                  ? "bg-[#141414] text-white hover:bg-[#2d2d2d] opacity-80"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              {isComplete ? "Save & return to application" : hasAny ? "Save progress" : "Return to application"}
            </button>
            {isProhibited && (
              <p className="text-xs text-red-600 text-center">Resolve the eligibility issue above before submitting.</p>
            )}
            {hasAny && !isComplete && !isProhibited && (
              <p className="text-xs text-hs-text-subtle text-center">Your progress is saved — you can return to complete this section anytime.</p>
            )}
          </div>

        </div>
      </div>
      {showInvite && (
        <InviteModal
          sectionTitle="Business identity"
          onClose={() => setShowInvite(false)}
          onSend={addInvite}
        />
      )}
    </div>
  );
}
