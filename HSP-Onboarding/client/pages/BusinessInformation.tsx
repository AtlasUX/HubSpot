import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingHeader } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { INDUSTRIES, getDescriptionRestriction, type Industry } from "@/data/industries";

export default function BusinessInformation() {
  const navigate = useNavigate();
  const {
    legalBusinessName, setLegalBusinessName,
    doingBusinessAs, setDoingBusinessAs,
    industry, setIndustry,
    productsOrServices, setProductsOrServices,
  } = useOnboarding();

  const [search, setSearch] = useState("");

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
            <input
              type="text"
              value={legalBusinessName}
              onChange={(e) => setLegalBusinessName(e.target.value)}
              placeholder="e.g. Acme Corporation LLC"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors text-sm"
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
                  <div className="flex gap-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-amber-500 flex-shrink-0">⚠</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-amber-700">
                        Requires prior approval
                      </span>
                      <span className="text-sm text-amber-600">
                        {selectedIndustry.restrictionReason}
                      </span>
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
