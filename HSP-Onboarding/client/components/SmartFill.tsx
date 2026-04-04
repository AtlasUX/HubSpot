import { useState, useRef, useCallback } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";

type FillStatus = "idle" | "processing" | "preview" | "done";

interface ExtractedData {
  legalBusinessName: string;
  ein: string;
  businessAddressStreet: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
}

/** Simulates OCR extraction from an IRS document. In production, calls a document AI API. */
function simulateExtraction(): Promise<ExtractedData> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          legalBusinessName: "Acme Consulting LLC",
          ein: "82-4731592",
          businessAddressStreet: "123 Business Ave, Suite 400",
          businessAddressCity: "Austin",
          businessAddressState: "TX",
          businessAddressZip: "78701",
        }),
      2200
    )
  );
}

const fieldLabels: Record<keyof ExtractedData, string> = {
  legalBusinessName: "Legal business name",
  ein: "EIN",
  businessAddressStreet: "Address",
  businessAddressCity: "City",
  businessAddressState: "State",
  businessAddressZip: "ZIP",
};

function UploadZone({
  onFile,
  processing,
}: {
  onFile: (file: File) => void;
  processing: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !processing && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed px-6 py-8 cursor-pointer transition-all duration-150
        ${isDragging ? "border-[#4ABACD] bg-[#f0fafb]" : "border-gray-200 bg-gray-50 hover:border-[#4ABACD] hover:bg-[#f0fafb]"}
        ${processing ? "pointer-events-none opacity-60" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
      {processing ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#4ABACD] border-t-transparent rounded-full animate-spin" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-hs-obsidian">Reading your document…</span>
            <span className="text-xs text-hs-text-subtle">Extracting business details</span>
          </div>
        </div>
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-[#4ABACD]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm font-semibold text-hs-obsidian">IRS EIN letter</span>
            <span className="text-xs text-hs-text-subtle">147C or SS-4 confirmation · PDF or photo</span>
          </div>
          <span className="text-xs text-[#4ABACD] font-medium">
            Drop here or click to upload
          </span>
          <div className="flex flex-wrap gap-1 justify-center mt-1">
            {["Legal name", "EIN", "Address"].map((tag) => (
              <span key={tag} className="text-xs bg-[#e8f4f7] text-[#0091AE] px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SmartFill() {
  const {
    setLegalBusinessName,
    setEin,
    setBusinessAddressStreet,
    setBusinessAddressCity,
    setBusinessAddressState,
    setBusinessAddressZip,
  } = useOnboarding();

  const [status, setStatus] = useState<FillStatus>("idle");
  const [fileName, setFileName] = useState("");
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [edits, setEdits] = useState<ExtractedData | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setStatus("processing");
    const data = await simulateExtraction();
    setExtracted(data);
    setEdits({ ...data });
    setStatus("preview");
  };

  const handleApply = () => {
    if (!edits) return;
    setLegalBusinessName(edits.legalBusinessName);
    setEin(edits.ein);
    setBusinessAddressStreet(edits.businessAddressStreet);
    setBusinessAddressCity(edits.businessAddressCity);
    setBusinessAddressState(edits.businessAddressState);
    setBusinessAddressZip(edits.businessAddressZip);
    setStatus("done");
  };

  const handleReset = () => {
    setStatus("idle");
    setExtracted(null);
    setEdits(null);
    setFileName("");
  };

  if (status === "done") {
    return (
      <div className="flex items-center justify-between px-5 py-4 rounded-xl bg-[#f0fafb] border border-[#4ABACD]/30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#4ABACD] flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6L4.5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-hs-obsidian">Auto-filled from {fileName}</span>
            <p className="text-xs text-hs-text-subtle">Business details, EIN, and address applied · Review each section before submitting</p>
          </div>
        </div>
        <button onClick={handleReset} className="text-xs text-hs-text-subtle hover:text-[#0091AE] transition-colors flex-shrink-0 ml-4">
          Upload another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left w-full"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-hs-obsidian">Auto-fill from documents</span>
            <p className="text-xs text-hs-text-subtle">Upload your IRS letter to fill multiple sections instantly</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 p-5 bg-white">
          {status === "preview" && edits ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#4ABACD] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-sm font-semibold text-hs-obsidian">Found in {fileName} — review before applying</span>
              </div>

              <div className="flex flex-col gap-2">
                {(Object.keys(fieldLabels) as (keyof ExtractedData)[]).map((key) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-hs-text-subtle w-28 flex-shrink-0">{fieldLabels[key]}</span>
                    <input
                      type="text"
                      value={edits[key]}
                      onChange={(e) => setEdits({ ...edits, [key]: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-hs-obsidian focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors"
                    />
                  </div>
                ))}
              </div>

              <p className="text-xs text-hs-text-subtle">
                Fills: <span className="text-hs-obsidian font-medium">Business details · Financials (EIN) · Address</span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 rounded-lg bg-[#141414] text-white text-sm font-semibold hover:bg-[#2d2d2d] transition-colors"
                >
                  Apply to application
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-hs-text-subtle hover:border-gray-300 hover:text-hs-obsidian transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <UploadZone onFile={handleFile} processing={status === "processing"} />

              {/* Bank statement — coming soon */}
              <div className="flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed border-gray-100 bg-gray-50/50 px-6 py-8 opacity-60 cursor-not-allowed">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-sm font-semibold text-hs-text-subtle">Bank statement</span>
                  <span className="text-xs text-hs-text-subtle">Connect via Plaid · Coming soon</span>
                </div>
                <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  Coming soon
                </span>
                <div className="flex flex-wrap gap-1 justify-center mt-1">
                  {["Account number", "Routing number"].map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
