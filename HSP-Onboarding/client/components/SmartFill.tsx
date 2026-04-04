import { useState, useRef, useCallback } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = "idle" | "processing" | "preview" | "done";
type PlaidStatus = "idle" | "picker" | "connecting" | "done";
type CrmStatus = "idle" | "connecting" | "preview" | "done";

interface IrsData {
  legalBusinessName: string;
  ein: string;
  businessAddressStreet: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
}

interface OperatingAgreementData {
  legalBusinessName: string;
  doingBusinessAs: string;
  businessAddressStreet: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
  ownerFirstName: string;
  ownerLastName: string;
}

interface ArticlesData {
  legalBusinessName: string;
  businessAddressStreet: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
  repFirstName: string;
  repLastName: string;
  repJobTitle: string;
}

interface BusinessLicenseData {
  legalBusinessName: string;
  doingBusinessAs: string;
  businessAddressStreet: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
}

interface PlaidData {
  bankName: string;
  accountLast4: string;
  routingNumber: string;
  accountHolder: string;
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

const BANKS = [
  { id: "chase", name: "Chase", color: "#117ACA" },
  { id: "bofa", name: "Bank of America", color: "#E31837" },
  { id: "wells", name: "Wells Fargo", color: "#D71E28" },
  { id: "citi", name: "Citibank", color: "#003B70" },
  { id: "usbank", name: "U.S. Bank", color: "#003087" },
  { id: "pnc", name: "PNC", color: "#F58025" },
];

function simulateIrs(): Promise<IrsData> {
  return new Promise((r) =>
    setTimeout(() => r({
      legalBusinessName: "Acme Consulting LLC",
      ein: "82-4731592",
      businessAddressStreet: "123 Business Ave, Suite 400",
      businessAddressCity: "Austin",
      businessAddressState: "TX",
      businessAddressZip: "78701",
    }), 2200)
  );
}

function simulateOperatingAgreement(): Promise<OperatingAgreementData> {
  return new Promise((r) =>
    setTimeout(() => r({
      legalBusinessName: "Acme Consulting LLC",
      doingBusinessAs: "Acme Consulting",
      businessAddressStreet: "123 Business Ave, Suite 400",
      businessAddressCity: "Austin",
      businessAddressState: "TX",
      businessAddressZip: "78701",
      ownerFirstName: "John",
      ownerLastName: "Smith",
    }), 2000)
  );
}

function simulateArticles(): Promise<ArticlesData> {
  return new Promise((r) =>
    setTimeout(() => r({
      legalBusinessName: "Acme Consulting Inc.",
      businessAddressStreet: "123 Business Ave, Suite 400",
      businessAddressCity: "Austin",
      businessAddressState: "TX",
      businessAddressZip: "78701",
      repFirstName: "John",
      repLastName: "Smith",
      repJobTitle: "Director",
    }), 2000)
  );
}

function simulateBusinessLicense(): Promise<BusinessLicenseData> {
  return new Promise((r) =>
    setTimeout(() => r({
      legalBusinessName: "Acme Consulting LLC",
      doingBusinessAs: "Acme Consulting",
      businessAddressStreet: "123 Business Ave, Suite 400",
      businessAddressCity: "Austin",
      businessAddressState: "TX",
      businessAddressZip: "78701",
    }), 1800)
  );
}

function simulatePlaid(bankId: string): Promise<PlaidData> {
  const bank = BANKS.find((b) => b.id === bankId)!;
  return new Promise((r) =>
    setTimeout(() => r({
      bankName: bank.name,
      accountLast4: "4821",
      routingNumber: "021000021",
      accountHolder: "Acme Consulting LLC",
    }), 2000)
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

function SlotCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs bg-[#e8f4f7] text-[#0091AE] px-2 py-0.5 rounded-full">
      {children}
    </span>
  );
}

// ─── IRS Upload slot ──────────────────────────────────────────────────────────

function IrsSlot() {
  const {
    setLegalBusinessName, setEin,
    setBusinessAddressStreet, setBusinessAddressCity,
    setBusinessAddressState, setBusinessAddressZip,
  } = useOnboarding();

  const [status, setStatus] = useState<DocStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState<IrsData | null>(null);
  const [edits, setEdits] = useState<IrsData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStatus("processing");
    const result = await simulateIrs();
    setData(result);
    setEdits({ ...result });
    setStatus("preview");
  }, []);

  const apply = () => {
    if (!edits) return;
    setLegalBusinessName(edits.legalBusinessName);
    setEin(edits.ein);
    setBusinessAddressStreet(edits.businessAddressStreet);
    setBusinessAddressCity(edits.businessAddressCity);
    setBusinessAddressState(edits.businessAddressState);
    setBusinessAddressZip(edits.businessAddressZip);
    setStatus("done");
  };

  const reset = () => { setStatus("idle"); setData(null); setEdits(null); setFileName(""); };

  const FIELD_LABELS: [keyof IrsData, string][] = [
    ["legalBusinessName", "Legal name"],
    ["ein", "EIN"],
    ["businessAddressStreet", "Address"],
    ["businessAddressCity", "City"],
    ["businessAddressState", "State"],
    ["businessAddressZip", "ZIP"],
  ];

  if (status === "done") {
    return (
      <SlotCard>
        <div className="flex items-center gap-3 p-4">
          <div className="w-6 h-6 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-hs-obsidian truncate">IRS letter applied</p>
            <p className="text-xs text-hs-text-subtle truncate">{fileName}</p>
          </div>
          <button onClick={reset} className="text-xs text-hs-text-subtle hover:text-[#0091AE] flex-shrink-0">Redo</button>
        </div>
      </SlotCard>
    );
  }

  if (status === "preview" && edits) {
    return (
      <SlotCard>
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-hs-obsidian">Review extracted data</p>
          <div className="flex flex-col gap-2">
            {FIELD_LABELS.map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-hs-text-subtle w-20 flex-shrink-0">{label}</span>
                <input
                  value={edits[key]}
                  onChange={(e) => setEdits({ ...edits, [key]: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#4ABACD] transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={apply} className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-xs font-semibold hover:bg-[#2d2d2d] transition-colors">Apply</button>
            <button onClick={reset} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-hs-text-subtle hover:border-gray-300 transition-colors">Discard</button>
          </div>
        </div>
      </SlotCard>
    );
  }

  return (
    <SlotCard>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => status === "idle" && inputRef.current?.click()}
        className={`flex flex-col items-center gap-3 p-5 cursor-pointer transition-colors
          ${dragging ? "bg-[#f0fafb]" : "bg-gray-50 hover:bg-[#f0fafb]"}
          ${status === "processing" ? "pointer-events-none" : ""}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {status === "processing" ? (
          <ProcessingSpinner label="Reading IRS document…" sublabel="Extracting business details" />
        ) : (
          <>
            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-[#4ABACD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-hs-obsidian">IRS EIN letter</p>
              <p className="text-xs text-hs-text-subtle">147C or SS-4 · PDF or photo</p>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {["Legal name", "EIN", "Address"].map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <span className="text-xs text-[#4ABACD] font-medium">Drop or click to upload</span>
          </>
        )}
      </div>
    </SlotCard>
  );
}

// ─── Operating Agreement slot ─────────────────────────────────────────────────

function OperatingAgreementSlot() {
  const {
    setLegalBusinessName, setDoingBusinessAs,
    setBusinessAddressStreet, setBusinessAddressCity,
    setBusinessAddressState, setBusinessAddressZip,
    setOwnerFirstName, setOwnerLastName,
  } = useOnboarding();

  const [status, setStatus] = useState<DocStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState<OperatingAgreementData | null>(null);
  const [edits, setEdits] = useState<OperatingAgreementData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStatus("processing");
    const result = await simulateOperatingAgreement();
    setData(result);
    setEdits({ ...result });
    setStatus("preview");
  }, []);

  const apply = () => {
    if (!edits) return;
    setLegalBusinessName(edits.legalBusinessName);
    setDoingBusinessAs(edits.doingBusinessAs);
    setBusinessAddressStreet(edits.businessAddressStreet);
    setBusinessAddressCity(edits.businessAddressCity);
    setBusinessAddressState(edits.businessAddressState);
    setBusinessAddressZip(edits.businessAddressZip);
    setOwnerFirstName(edits.ownerFirstName);
    setOwnerLastName(edits.ownerLastName);
    setStatus("done");
  };

  const reset = () => { setStatus("idle"); setData(null); setEdits(null); setFileName(""); };

  const FIELD_LABELS: [keyof OperatingAgreementData, string][] = [
    ["legalBusinessName", "Legal name"],
    ["doingBusinessAs", "DBA"],
    ["businessAddressStreet", "Address"],
    ["businessAddressCity", "City"],
    ["businessAddressState", "State"],
    ["businessAddressZip", "ZIP"],
    ["ownerFirstName", "Owner first"],
    ["ownerLastName", "Owner last"],
  ];

  if (status === "done") {
    return (
      <SlotCard>
        <div className="flex items-center gap-3 p-4">
          <div className="w-6 h-6 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-hs-obsidian truncate">Operating agreement applied</p>
            <p className="text-xs text-hs-text-subtle truncate">{fileName}</p>
          </div>
          <button onClick={reset} className="text-xs text-hs-text-subtle hover:text-[#0091AE] flex-shrink-0">Redo</button>
        </div>
      </SlotCard>
    );
  }

  if (status === "preview" && edits) {
    return (
      <SlotCard>
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-hs-obsidian">Review extracted data</p>
          <div className="flex flex-col gap-2">
            {FIELD_LABELS.map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-hs-text-subtle w-20 flex-shrink-0">{label}</span>
                <input
                  value={edits[key]}
                  onChange={(e) => setEdits({ ...edits, [key]: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#4ABACD] transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={apply} className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-xs font-semibold hover:bg-[#2d2d2d] transition-colors">Apply</button>
            <button onClick={reset} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-hs-text-subtle hover:border-gray-300 transition-colors">Discard</button>
          </div>
        </div>
      </SlotCard>
    );
  }

  return (
    <SlotCard>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => status === "idle" && inputRef.current?.click()}
        className={`flex flex-col items-center gap-3 p-5 cursor-pointer transition-colors
          ${dragging ? "bg-[#f0fafb]" : "bg-gray-50 hover:bg-[#f0fafb]"}
          ${status === "processing" ? "pointer-events-none" : ""}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {status === "processing" ? (
          <ProcessingSpinner label="Reading operating agreement…" sublabel="Extracting business & owner details" />
        ) : (
          <>
            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-[#4ABACD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-hs-obsidian">Operating agreement</p>
              <p className="text-xs text-hs-text-subtle">LLC · PDF or photo</p>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {["Legal name", "DBA", "Address", "Owners"].map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <span className="text-xs text-[#4ABACD] font-medium">Drop or click to upload</span>
          </>
        )}
      </div>
    </SlotCard>
  );
}

// ─── Articles of Incorporation / Organization slot ────────────────────────────

function ArticlesSlot() {
  const {
    setLegalBusinessName,
    setBusinessAddressStreet, setBusinessAddressCity,
    setBusinessAddressState, setBusinessAddressZip,
    setRepFirstName, setRepLastName, setRepJobTitle,
  } = useOnboarding();

  const [status, setStatus] = useState<DocStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState<ArticlesData | null>(null);
  const [edits, setEdits] = useState<ArticlesData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStatus("processing");
    const result = await simulateArticles();
    setData(result);
    setEdits({ ...result });
    setStatus("preview");
  }, []);

  const apply = () => {
    if (!edits) return;
    setLegalBusinessName(edits.legalBusinessName);
    setBusinessAddressStreet(edits.businessAddressStreet);
    setBusinessAddressCity(edits.businessAddressCity);
    setBusinessAddressState(edits.businessAddressState);
    setBusinessAddressZip(edits.businessAddressZip);
    setRepFirstName(edits.repFirstName);
    setRepLastName(edits.repLastName);
    setRepJobTitle(edits.repJobTitle);
    setStatus("done");
  };

  const reset = () => { setStatus("idle"); setData(null); setEdits(null); setFileName(""); };

  const FIELD_LABELS: [keyof ArticlesData, string][] = [
    ["legalBusinessName", "Legal name"],
    ["businessAddressStreet", "Address"],
    ["businessAddressCity", "City"],
    ["businessAddressState", "State"],
    ["businessAddressZip", "ZIP"],
    ["repFirstName", "Rep first"],
    ["repLastName", "Rep last"],
    ["repJobTitle", "Rep title"],
  ];

  if (status === "done") {
    return (
      <SlotCard>
        <div className="flex items-center gap-3 p-4">
          <div className="w-6 h-6 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-hs-obsidian truncate">Articles applied</p>
            <p className="text-xs text-hs-text-subtle truncate">{fileName}</p>
          </div>
          <button onClick={reset} className="text-xs text-hs-text-subtle hover:text-[#0091AE] flex-shrink-0">Redo</button>
        </div>
      </SlotCard>
    );
  }

  if (status === "preview" && edits) {
    return (
      <SlotCard>
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-hs-obsidian">Review extracted data</p>
          <div className="flex flex-col gap-2">
            {FIELD_LABELS.map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-hs-text-subtle w-20 flex-shrink-0">{label}</span>
                <input
                  value={edits[key]}
                  onChange={(e) => setEdits({ ...edits, [key]: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#4ABACD] transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={apply} className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-xs font-semibold hover:bg-[#2d2d2d] transition-colors">Apply</button>
            <button onClick={reset} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-hs-text-subtle hover:border-gray-300 transition-colors">Discard</button>
          </div>
        </div>
      </SlotCard>
    );
  }

  return (
    <SlotCard>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => status === "idle" && inputRef.current?.click()}
        className={`flex flex-col items-center gap-3 p-5 cursor-pointer transition-colors
          ${dragging ? "bg-[#f0fafb]" : "bg-gray-50 hover:bg-[#f0fafb]"}
          ${status === "processing" ? "pointer-events-none" : ""}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {status === "processing" ? (
          <ProcessingSpinner label="Reading articles…" sublabel="Extracting business & representative details" />
        ) : (
          <>
            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-[#4ABACD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-hs-obsidian">Articles of incorporation</p>
              <p className="text-xs text-hs-text-subtle">Corp or LLC state filing · PDF</p>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {["Legal name", "Address", "Representative"].map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <span className="text-xs text-[#4ABACD] font-medium">Drop or click to upload</span>
          </>
        )}
      </div>
    </SlotCard>
  );
}

// ─── Business License / DBA filing slot ───────────────────────────────────────

function BusinessLicenseSlot() {
  const {
    setLegalBusinessName, setDoingBusinessAs,
    setBusinessAddressStreet, setBusinessAddressCity,
    setBusinessAddressState, setBusinessAddressZip,
  } = useOnboarding();

  const [status, setStatus] = useState<DocStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState<BusinessLicenseData | null>(null);
  const [edits, setEdits] = useState<BusinessLicenseData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setStatus("processing");
    const result = await simulateBusinessLicense();
    setData(result);
    setEdits({ ...result });
    setStatus("preview");
  }, []);

  const apply = () => {
    if (!edits) return;
    setLegalBusinessName(edits.legalBusinessName);
    setDoingBusinessAs(edits.doingBusinessAs);
    setBusinessAddressStreet(edits.businessAddressStreet);
    setBusinessAddressCity(edits.businessAddressCity);
    setBusinessAddressState(edits.businessAddressState);
    setBusinessAddressZip(edits.businessAddressZip);
    setStatus("done");
  };

  const reset = () => { setStatus("idle"); setData(null); setEdits(null); setFileName(""); };

  const FIELD_LABELS: [keyof BusinessLicenseData, string][] = [
    ["legalBusinessName", "Legal name"],
    ["doingBusinessAs", "DBA"],
    ["businessAddressStreet", "Address"],
    ["businessAddressCity", "City"],
    ["businessAddressState", "State"],
    ["businessAddressZip", "ZIP"],
  ];

  if (status === "done") {
    return (
      <SlotCard>
        <div className="flex items-center gap-3 p-4">
          <div className="w-6 h-6 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-hs-obsidian truncate">Business license applied</p>
            <p className="text-xs text-hs-text-subtle truncate">{fileName}</p>
          </div>
          <button onClick={reset} className="text-xs text-hs-text-subtle hover:text-[#0091AE] flex-shrink-0">Redo</button>
        </div>
      </SlotCard>
    );
  }

  if (status === "preview" && edits) {
    return (
      <SlotCard>
        <div className="p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-hs-obsidian">Review extracted data</p>
          <div className="flex flex-col gap-2">
            {FIELD_LABELS.map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-hs-text-subtle w-20 flex-shrink-0">{label}</span>
                <input
                  value={edits[key]}
                  onChange={(e) => setEdits({ ...edits, [key]: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:border-[#4ABACD] transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={apply} className="flex-1 py-2 rounded-lg bg-[#141414] text-white text-xs font-semibold hover:bg-[#2d2d2d] transition-colors">Apply</button>
            <button onClick={reset} className="px-3 py-2 rounded-lg border border-gray-200 text-xs text-hs-text-subtle hover:border-gray-300 transition-colors">Discard</button>
          </div>
        </div>
      </SlotCard>
    );
  }

  return (
    <SlotCard>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => status === "idle" && inputRef.current?.click()}
        className={`flex flex-col items-center gap-3 p-5 cursor-pointer transition-colors
          ${dragging ? "bg-[#f0fafb]" : "bg-gray-50 hover:bg-[#f0fafb]"}
          ${status === "processing" ? "pointer-events-none" : ""}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        {status === "processing" ? (
          <ProcessingSpinner label="Reading business license…" sublabel="Extracting name & address" />
        ) : (
          <>
            <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-[#4ABACD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-hs-obsidian">Business license or DBA filing</p>
              <p className="text-xs text-hs-text-subtle">State or county · PDF or photo</p>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {["Legal name", "DBA", "Address"].map((t) => <Tag key={t}>{t}</Tag>)}
            </div>
            <span className="text-xs text-[#4ABACD] font-medium">Drop or click to upload</span>
          </>
        )}
      </div>
    </SlotCard>
  );
}

// ─── Plaid bank linking slot ──────────────────────────────────────────────────

function PlaidSlot() {
  const { setBankStatementDescription } = useOnboarding();
  const [status, setStatus] = useState<PlaidStatus>("idle");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [plaidData, setPlaidData] = useState<PlaidData | null>(null);

  const connect = async (bankId: string) => {
    setSelectedBank(bankId);
    setStatus("connecting");
    const result = await simulatePlaid(bankId);
    setPlaidData(result);
    setBankStatementDescription(result.accountHolder.substring(0, 22));
    setStatus("done");
  };

  const reset = () => { setStatus("idle"); setSelectedBank(null); setPlaidData(null); };

  if (status === "done" && plaidData) {
    return (
      <SlotCard>
        <div className="flex items-center gap-3 p-4">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-hs-obsidian">{plaidData.bankName} connected</p>
            <p className="text-xs text-hs-text-subtle">Account ····{plaidData.accountLast4} · Routing {plaidData.routingNumber}</p>
          </div>
          <button onClick={reset} className="text-xs text-hs-text-subtle hover:text-[#0091AE] flex-shrink-0">Change</button>
        </div>
      </SlotCard>
    );
  }

  if (status === "picker") {
    return (
      <SlotCard>
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-hs-obsidian">Select your bank</p>
            <button onClick={() => setStatus("idle")} className="text-xs text-hs-text-subtle hover:text-hs-obsidian">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {BANKS.map((bank) => (
              <button
                key={bank.id}
                onClick={() => connect(bank.id)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 hover:border-[#4ABACD] hover:bg-[#f0fafb] transition-colors text-left"
              >
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bank.color }}>
                  <span className="text-white text-[8px] font-bold">{bank.name[0]}</span>
                </div>
                <span className="text-xs font-medium text-hs-obsidian truncate">{bank.name}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-hs-text-subtle text-center">Secured by Plaid · Read-only access</p>
        </div>
      </SlotCard>
    );
  }

  if (status === "connecting") {
    return (
      <SlotCard>
        <ProcessingSpinner
          label={`Connecting to ${BANKS.find((b) => b.id === selectedBank)?.name}…`}
          sublabel="Verifying account access"
        />
      </SlotCard>
    );
  }

  return (
    <SlotCard>
      <div className="flex flex-col items-center gap-3 p-5 bg-gray-50">
        <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-hs-obsidian">Bank account for payouts</p>
          <p className="text-xs text-hs-text-subtle">Connect via Plaid · Read-only</p>
        </div>
        <div className="flex flex-wrap gap-1 justify-center">
          {["Routing number", "Account number"].map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
        <button
          onClick={() => setStatus("picker")}
          className="text-xs text-[#4ABACD] font-medium hover:text-[#0091AE] transition-colors"
        >
          Connect bank account →
        </button>
      </div>
    </SlotCard>
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
          <p className="text-xs text-hs-text-subtle">
            Pull your company name, website, address & email from your CRM record
          </p>
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
        <div className="border-t border-gray-100 p-5 bg-white flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide px-0.5">Documents</p>
            <div className="grid grid-cols-2 gap-3">
              <IrsSlot />
              <OperatingAgreementSlot />
              <ArticlesSlot />
              <BusinessLicenseSlot />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-hs-text-subtle uppercase tracking-wide px-0.5">Connections</p>
            <PlaidSlot />
            <CrmSlot />
          </div>
        </div>
      )}
    </div>
  );
}
