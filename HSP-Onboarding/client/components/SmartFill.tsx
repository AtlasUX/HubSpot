import { useState, useRef, useCallback } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = "idle" | "processing" | "preview" | "done";
type CrmStatus = "idle" | "connecting" | "preview" | "done";

interface BusinessDocData {
  legalBusinessName: string;
  doingBusinessAs: string;
  ein: string;
  businessAddressStreet: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
  ownerFirstName: string;
  ownerLastName: string;
  repFirstName: string;
  repLastName: string;
  repJobTitle: string;
}

interface CrmData {
  legalBusinessName: string;
  doingBusinessAs: string;
  businessWebsite: string;
  contactEmail: string;
  businessAddressStreet: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
}

// ─── Simulated data ───────────────────────────────────────────────────────────

function simulateBusinessDoc(): Promise<BusinessDocData> {
  return new Promise((r) =>
    setTimeout(() => r({
      legalBusinessName: "Acme Consulting LLC",
      doingBusinessAs: "Acme Consulting",
      ein: "82-4731592",
      businessAddressStreet: "123 Business Ave, Suite 400",
      businessAddressCity: "Austin",
      businessAddressState: "TX",
      businessAddressZip: "78701",
      ownerFirstName: "John",
      ownerLastName: "Smith",
      repFirstName: "John",
      repLastName: "Smith",
      repJobTitle: "Managing Member",
    }), 2200)
  );
}

function simulateCrm(): Promise<CrmData> {
  return new Promise((r) =>
    setTimeout(() => r({
      legalBusinessName: "Acme Consulting LLC",
      doingBusinessAs: "Acme Consulting",
      businessWebsite: "https://acmeconsulting.com",
      contactEmail: "hello@acmeconsulting.com",
      businessAddressStreet: "123 Business Ave, Suite 400",
      businessAddressCity: "Austin",
      businessAddressState: "TX",
      businessAddressZip: "78701",
    }), 1800)
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProcessingSpinner({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="w-8 h-8 border-2 border-[#4ABACD] border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-sm font-medium text-hs-obsidian">{label}</p>
        <p className="text-xs text-hs-text-subtle">{sublabel}</p>
      </div>
    </div>
  );
}

// ─── Business document upload slot ────────────────────────────────────────────

function BusinessDocSlot() {
  const {
    setLegalBusinessName, setDoingBusinessAs, setEin,
    setBusinessAddressStreet, setBusinessAddressCity,
    setBusinessAddressState, setBusinessAddressZip,
    setOwnerFirstName, setOwnerLastName,
    setRepFirstName, setRepLastName, setRepJobTitle,
  } = useOnboarding();

  const [status, setStatus] = useState<DocStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [edits, setEdits] = useState<BusinessDocData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStatus("processing");
    const result = await simulateBusinessDoc();
    setEdits({ ...result });
    setStatus("preview");
  }, []);

  const apply = () => {
    if (!edits) return;
    if (edits.legalBusinessName) setLegalBusinessName(edits.legalBusinessName);
    if (edits.doingBusinessAs) setDoingBusinessAs(edits.doingBusinessAs);
    if (edits.ein) setEin(edits.ein);
    if (edits.businessAddressStreet) setBusinessAddressStreet(edits.businessAddressStreet);
    if (edits.businessAddressCity) setBusinessAddressCity(edits.businessAddressCity);
    if (edits.businessAddressState) setBusinessAddressState(edits.businessAddressState);
    if (edits.businessAddressZip) setBusinessAddressZip(edits.businessAddressZip);
    if (edits.ownerFirstName) setOwnerFirstName(edits.ownerFirstName);
    if (edits.ownerLastName) setOwnerLastName(edits.ownerLastName);
    if (edits.repFirstName) setRepFirstName(edits.repFirstName);
    if (edits.repLastName) setRepLastName(edits.repLastName);
    if (edits.repJobTitle) setRepJobTitle(edits.repJobTitle);
    setStatus("done");
  };

  const reset = () => { setStatus("idle"); setEdits(null); setFileName(""); };

  const FIELD_LABELS: [keyof BusinessDocData, string][] = [
    ["legalBusinessName", "Legal name"],
    ["doingBusinessAs", "DBA"],
    ["ein", "EIN"],
    ["businessAddressStreet", "Address"],
    ["businessAddressCity", "City"],
    ["businessAddressState", "State"],
    ["businessAddressZip", "ZIP"],
    ["ownerFirstName", "Owner first"],
    ["ownerLastName", "Owner last"],
    ["repFirstName", "Rep first"],
    ["repLastName", "Rep last"],
    ["repJobTitle", "Rep title"],
  ];

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <div className="w-7 h-7 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-hs-obsidian">Document applied</p>
          <p className="text-xs text-hs-text-subtle truncate">{fileName}</p>
        </div>
        <button onClick={reset} className="text-xs text-hs-text-subtle hover:text-[#0091AE] flex-shrink-0">Upload another</button>
      </div>
    );
  }

  if (status === "preview" && edits) {
    return (
      <div className="flex flex-col gap-3 px-4 py-4 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-hs-obsidian">Review extracted data</p>
          <p className="text-xs text-hs-text-subtle truncate max-w-[160px]">{fileName}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {FIELD_LABELS.map(([key, label]) => (
            <div key={key} className="flex flex-col gap-0.5">
              <span className="text-[10px] text-hs-text-subtle uppercase tracking-wide font-medium">{label}</span>
              <input
                value={edits[key]}
                onChange={(e) => setEdits({ ...edits, [key]: e.target.value })}
                className="px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#4ABACD] transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={apply} className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-xs font-semibold hover:bg-[#2d2d2d] transition-colors">Apply to application</button>
          <button onClick={reset} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-hs-text-subtle hover:border-gray-300 transition-colors">Discard</button>
        </div>
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50">
        <ProcessingSpinner label="Reading document…" sublabel="Extracting business details" />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      onClick={() => inputRef.current?.click()}
      className={`flex items-center gap-4 px-5 py-4 rounded-xl border cursor-pointer transition-colors ${
        dragging ? "border-[#4ABACD] bg-[#f0fafb]" : "border-dashed border-gray-300 bg-gray-50 hover:border-[#4ABACD] hover:bg-[#f0fafb]"
      }`}
    >
      <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm flex-shrink-0">
        <svg className="w-4 h-4 text-[#4ABACD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-hs-obsidian">Business entity documents</p>
          <span className="text-[10px] font-semibold text-hs-text-subtle bg-gray-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Optional</span>
        </div>
        <p className="text-xs text-hs-text-subtle">Upload your IRS EIN letter, operating agreement, articles of incorporation, or business license — we'll autofill as much of your application as possible</p>
      </div>
      <span className="text-xs text-[#4ABACD] font-medium flex-shrink-0 ml-auto pl-3">Browse</span>
    </div>
  );
}

// ─── HubSpot CRM slot ─────────────────────────────────────────────────────────

function CrmSlot() {
  const {
    setLegalBusinessName, setDoingBusinessAs,
    setBusinessWebsite, setContactEmail,
    setBusinessAddressStreet, setBusinessAddressCity,
    setBusinessAddressState, setBusinessAddressZip,
  } = useOnboarding();

  const [status, setCrmStatus] = useState<CrmStatus>("idle");
  const [data, setData] = useState<CrmData | null>(null);
  const [edits, setEdits] = useState<CrmData | null>(null);

  const connect = async () => {
    setCrmStatus("connecting");
    const result = await simulateCrm();
    setData(result);
    setEdits({ ...result });
    setCrmStatus("preview");
  };

  const apply = () => {
    if (!edits) return;
    setLegalBusinessName(edits.legalBusinessName);
    setDoingBusinessAs(edits.doingBusinessAs);
    setBusinessWebsite(edits.businessWebsite);
    setContactEmail(edits.contactEmail);
    setBusinessAddressStreet(edits.businessAddressStreet);
    setBusinessAddressCity(edits.businessAddressCity);
    setBusinessAddressState(edits.businessAddressState);
    setBusinessAddressZip(edits.businessAddressZip);
    setCrmStatus("done");
  };

  const reset = () => { setCrmStatus("idle"); setData(null); setEdits(null); };

  const CRM_FIELDS: [keyof CrmData, string][] = [
    ["legalBusinessName", "Legal name"],
    ["doingBusinessAs", "DBA"],
    ["businessWebsite", "Website"],
    ["contactEmail", "Email"],
    ["businessAddressStreet", "Address"],
    ["businessAddressCity", "City"],
    ["businessAddressState", "State"],
    ["businessAddressZip", "ZIP"],
  ];

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#FF7A59"/>
          <path d="M9.5 12.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5z" fill="white"/>
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold text-hs-obsidian">HubSpot CRM connected</p>
          <p className="text-xs text-hs-text-subtle">Company data applied — {data?.legalBusinessName}</p>
        </div>
        <button onClick={reset} className="text-xs text-hs-text-subtle hover:text-[#0091AE]">Redo</button>
      </div>
    );
  }

  if (status === "preview" && edits) {
    return (
      <div className="flex flex-col gap-3 px-4 py-4 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#FF7A59"/>
            <path d="M9.5 12.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5z" fill="white"/>
          </svg>
          <p className="text-sm font-semibold text-hs-obsidian">Found in HubSpot CRM — review before applying</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CRM_FIELDS.map(([key, label]) => (
            <div key={key} className="flex flex-col gap-0.5">
              <span className="text-xs text-hs-text-subtle">{label}</span>
              <input
                value={edits[key]}
                onChange={(e) => setEdits({ ...edits, [key]: e.target.value })}
                className="px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#4ABACD] transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={apply} className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-xs font-semibold hover:bg-[#2d2d2d] transition-colors">Apply to application</button>
          <button onClick={reset} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-hs-text-subtle hover:border-gray-300 transition-colors">Discard</button>
        </div>
      </div>
    );
  }

  if (status === "connecting") {
    return (
      <div className="flex items-center gap-4 px-4 py-4 rounded-xl border border-gray-200 bg-white">
        <div className="w-6 h-6 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-hs-obsidian">Connecting to HubSpot CRM…</p>
          <p className="text-xs text-hs-text-subtle">Pulling company record</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3">
        <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#FF7A59"/>
          <path d="M9.5 12.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5z" fill="white"/>
        </svg>
        <div>
          <p className="text-sm font-semibold text-hs-obsidian">Pre-fill from HubSpot CRM</p>
          <p className="text-xs text-hs-text-subtle">Pull your company name, website, address & email</p>
        </div>
      </div>
      <button
        onClick={connect}
        className="flex-shrink-0 ml-4 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-hs-obsidian hover:border-[#FF7A59] hover:text-[#FF7A59] transition-colors"
      >
        Connect →
      </button>
    </div>
  );
}

// ─── Main SmartFill panel ─────────────────────────────────────────────────────

export default function SmartFill() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col rounded-xl border border-[#4ABACD]/40 overflow-hidden">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center justify-between px-5 py-4 bg-[#f0fafb] hover:bg-[#e8f5f8] transition-colors text-left w-full"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-hs-obsidian">Fill your application faster</p>
              <span className="text-[10px] font-semibold text-[#4ABACD] bg-[#4ABACD]/10 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Recommended</span>
            </div>
            <p className="text-xs text-hs-text-subtle">Upload documents or connect accounts — we'll autofill fields across your entire application</p>
          </div>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 p-5 bg-white flex flex-col gap-3">
          <BusinessDocSlot />
          <CrmSlot />
        </div>
      )}
    </div>
  );
}
