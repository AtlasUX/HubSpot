import { useState, useRef } from "react";

export const ALL_SECTIONS = [
  { id: "identity", title: "Business identity" },
  { id: "contact", title: "Contact & support" },
  { id: "financials", title: "Tax & financials" },
  { id: "representative", title: "Representative & owners" },
];

const MY_EMAIL = "singram@hubspot.com";

function deriveSubject(_sections: string[]): string {
  return "Help requested - HubSpot Payments enrollment";
}

function deriveMessage(sections: string[]): string {
  if (sections.length === 0) {
    return `Hi,\n\nI'm setting up HubSpot Payments for our business and could use your help with a few sections of our application.\n\nPlease follow the secure link below — it will only show you the sections you're responsible for. It should only take a few minutes.\n\nThank you!`;
  }
  const titles = sections.map((id) => ALL_SECTIONS.find((s) => s.id === id)?.title ?? "");
  const sectionList =
    titles.length === 1
      ? `the "${titles[0]}" section`
      : titles.length === 2
      ? `the "${titles[0]}" and "${titles[1]}" sections`
      : `${titles.length} sections: ${titles.map((t) => `"${t}"`).join(", ")}`;
  return `Hi,\n\nI'm setting up HubSpot Payments for our business and need your help completing ${sectionList} of our application.\n\nPlease follow the secure link below — it will only show you the sections you're responsible for. It should only take a few minutes.\n\nThank you!`;
}

export function InviteModal({ sectionTitle, onClose }: { sectionTitle: string; onClose: () => void }) {
  const initialId = ALL_SECTIONS.find((s) => s.title === sectionTitle)?.id ?? ALL_SECTIONS[0].id;
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([initialId]);
  const [sendFrom, setSendFrom] = useState<"hubspot" | "me">("hubspot");
  const [subject, setSubject] = useState(() => deriveSubject([initialId]));
  const [message, setMessage] = useState(() => deriveMessage([initialId]));
  const subjectCustomized = useRef(false);
  const messageCustomized = useRef(false);

  function toggleSection(id: string) {
    setSelectedSections((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      if (!subjectCustomized.current) {
        setSubject(deriveSubject(next));
      }
      if (!messageCustomized.current) {
        setMessage(deriveMessage(next));
      }
      return next;
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-8 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-hs-obsidian">Invite collaborator</h2>
          <p className="text-sm text-hs-text-subtle mt-0.5">They'll get a secure link to fill out only the sections you choose.</p>
        </div>

        {sent ? (
          <div className="px-8 py-8 flex flex-col items-center gap-3 text-center">
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
          <div className="px-8 py-5 flex flex-col gap-5">
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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  subjectCustomized.current = true;
                  setSubject(e.target.value);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-hs-obsidian placeholder-gray-300 focus:outline-none focus:border-[#4ABACD] focus:ring-1 focus:ring-[#4ABACD] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Sections they can fill out</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSection(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedSections.includes(s.id)
                        ? "border-[#4ABACD] bg-[#f0fafb] text-[#0091AE]"
                        : "border-gray-200 text-hs-text-subtle hover:border-gray-300 hover:text-hs-obsidian"
                    }`}
                  >
                    {selectedSections.includes(s.id) && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L4.5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-hs-obsidian">Send email from</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSendFrom("hubspot")}
                  className={`flex-1 flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-colors ${sendFrom === "hubspot" ? "border-[#4ABACD] bg-[#f0fafb]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span className="text-sm font-semibold text-hs-obsidian">HubSpot Payments</span>
                  <span className="text-xs text-hs-text-subtle mt-0.5">notifications@hubspot.com</span>
                </button>
                <button
                  onClick={() => setSendFrom("me")}
                  className={`flex-1 flex flex-col items-start px-4 py-3 rounded-lg border text-left transition-colors ${sendFrom === "me" ? "border-[#4ABACD] bg-[#f0fafb]" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <span className="text-sm font-semibold text-hs-obsidian">My email</span>
                  <span className="text-xs text-hs-text-subtle mt-0.5">{MY_EMAIL}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-hs-obsidian">Message</label>
              <textarea
                value={message}
                onChange={(e) => {
                  messageCustomized.current = true;
                  setMessage(e.target.value);
                }}
                rows={7}
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
