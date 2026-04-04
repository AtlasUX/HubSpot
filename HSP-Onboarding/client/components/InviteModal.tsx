import { useState } from "react";

export const ALL_SECTIONS = [
  { id: "structure", title: "Business structure" },
  { id: "details", title: "Business details" },
  { id: "address", title: "Address & contact" },
  { id: "financials", title: "Financials" },
  { id: "representative", title: "Business representative" },
  { id: "ownership", title: "Ownership" },
];

export function InviteModal({ sectionTitle, onClose }: { sectionTitle: string; onClose: () => void }) {
  const initialId = ALL_SECTIONS.find((s) => s.title === sectionTitle)?.id ?? ALL_SECTIONS[0].id;
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([initialId]);
  const [sendFrom, setSendFrom] = useState<"hubspot" | "me">("hubspot");
  const [message, setMessage] = useState(
    `Hi,\n\nI'm setting up HubSpot Payments for our business and need your help completing the "${sectionTitle}" section of our application.\n\nPlease follow the secure link below to fill in the required information. It should only take a few minutes.\n\nThank you!`
  );

  function toggleSection(id: string) {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-hs-obsidian">Invite someone to help</h2>
          <p className="text-sm text-hs-text-subtle mt-0.5">They'll get a secure link to fill out only the sections you choose.</p>
        </div>

        {sent ? (
          <div className="px-6 py-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f0fafb] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#4ABACD" />
                <path d="M7 12l3.5 3.5L17 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-hs-obsidian">Invite sent to {email}</p>
            <p className="text-xs text-hs-text-subtle">They'll receive a secure link for their sections. You'll be notified when they complete it.</p>
            <button onClick={onClose} className="mt-2 text-sm text-[#4ABACD] hover:underline">Done</button>
          </div>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Recipient's email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-hs-obsidian">Sections they can fill out</label>
              <div className="grid grid-cols-2 gap-1">
                {ALL_SECTIONS.map((s) => (
                  <label key={s.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedSections.includes(s.id)}
                      onChange={() => toggleSection(s.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#4ABACD] focus:ring-[#4ABACD]"
                    />
                    <span className="text-sm text-hs-obsidian leading-tight">{s.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-hs-obsidian">Send email from</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSendFrom("hubspot")}
                  className={`flex-1 flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-colors ${sendFrom === "hubspot" ? "border-[#4ABACD] bg-[#f0fafb]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span className="text-xs font-semibold text-hs-obsidian">HubSpot Payments</span>
                  <span className="text-xs text-hs-text-subtle">notifications@hubspot.com</span>
                </button>
                <button
                  onClick={() => setSendFrom("me")}
                  className={`flex-1 flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-colors ${sendFrom === "me" ? "border-[#4ABACD] bg-[#f0fafb]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span className="text-xs font-semibold text-hs-obsidian">My email</span>
                  <span className="text-xs text-hs-text-subtle">Sent on your behalf</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-hs-obsidian resize-none focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors"
              />
            </div>

            <div className="flex gap-3 pb-1">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-hs-text-subtle hover:border-gray-300 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => (email.trim() && selectedSections.length > 0) && setSent(true)}
                disabled={!email.trim() || selectedSections.length === 0}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  email.trim() && selectedSections.length > 0
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
