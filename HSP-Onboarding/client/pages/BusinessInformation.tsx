import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { INDUSTRIES, getDescriptionRestriction, type Industry } from "@/data/industries";
import { US_STATE_OPTIONS } from "@shared/usStates";

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

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm";

const labelClass = "text-sm font-semibold text-hs-obsidian";

export default function BusinessInformation() {
  const navigate = useNavigate();
  const {
    legalBusinessName, setLegalBusinessName,
    doingBusinessAs, setDoingBusinessAs,
    industry, setIndustry,
    productsOrServices, setProductsOrServices,
    businessAddressStreet, setBusinessAddressStreet,
    businessAddressStreetLine2, setBusinessAddressStreetLine2,
    businessAddressCity, setBusinessAddressCity,
    businessAddressState, setBusinessAddressState,
    businessAddressZip, setBusinessAddressZip,
  } = useOnboarding();

  const [search, setSearch] = useState("");
  const [registryResults, setRegistryResults] = useState<BusinessRegistryResult[]>([]);
  const [showRegistry, setShowRegistry] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const registryRef = useRef<HTMLDivElement>(null);

  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (businessAddressStreet.length >= 3 && addressFocused) {
      const results = getAddressSuggestions(businessAddressStreet);
      setAddressSuggestions(results);
      setShowAddressSuggestions(results.length > 0);
    } else {
      setShowAddressSuggestions(false);
    }
  }, [businessAddressStreet, addressFocused]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addressRef.current && !addressRef.current.contains(e.target as Node)) {
        setShowAddressSuggestions(false);
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
    setShowAddressSuggestions(false);
  }

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
    industry.length > 0 &&
    productsOrServices.trim().length >= 10 &&
    !isProhibited &&
    businessAddressStreet.trim().length > 0 &&
    businessAddressCity.trim().length > 0 &&
    businessAddressState.length > 0 &&
    businessAddressZip.trim().length >= 5;

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
              Business identity
            </h1>
            <p className="text-base text-hs-text-subtle">
              Used to verify your business and ensure compliance with payment network rules.
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

          {/* Registered address */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-0.5 pb-1 border-b border-gray-100">
              <h2 className="text-base font-semibold text-hs-obsidian">Registered business address</h2>
              <p className="text-sm text-hs-text-subtle">The legal address of your business as registered with authorities</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Address line 1<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative" ref={addressRef}>
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
                {showAddressSuggestions && (
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                    {addressSuggestions.map((s, i) => (
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
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Address line 2</label>
              <input
                type="text"
                value={businessAddressStreetLine2}
                onChange={(e) => setBusinessAddressStreetLine2(e.target.value)}
                placeholder="Suite, unit, building (optional)"
                className={inputClass}
              />
            </div>

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
