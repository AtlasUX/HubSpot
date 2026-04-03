import { useLocation } from "react-router-dom";

const PHASES = [
  {
    id: "location",
    label: "Where you operate",
    paths: ["/", "/general-information"],
    subSteps: [{ label: "Location", path: "/general-information" }],
  },
  {
    id: "business",
    label: "Your business",
    paths: [
      "/business-type",
      "/business-information",
      "/business-address-and-support",
      "/business-details-op2",
      "/business-financials",
    ],
    subSteps: [
      { label: "Structure", path: "/business-type" },
      { label: "Details", path: "/business-information" },
      { label: "Address", path: "/business-address-and-support" },
      { label: "Financials", path: "/business-financials" },
    ],
  },
  {
    id: "team",
    label: "Your team",
    paths: ["/business-representative", "/owners"],
    subSteps: [
      { label: "Representative", path: "/business-representative" },
      { label: "Owners", path: "/owners" },
    ],
  },
  {
    id: "review",
    label: "Confirm & launch",
    paths: ["/review-and-finish"],
    subSteps: [{ label: "Review", path: "/review-and-finish" }],
  },
];

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1.5 5L3.5 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PhaseProgress() {
  const { pathname } = useLocation();

  const currentPhaseIndex = PHASES.findIndex((p) =>
    p.paths.some((path) => pathname === path || pathname.startsWith(path + "/"))
  );

  const currentSubStepIndex = (phaseIndex: number) => {
    if (phaseIndex !== currentPhaseIndex) return -1;
    const phase = PHASES[phaseIndex];
    return phase.subSteps.findIndex((s) =>
      pathname === s.path || pathname.startsWith(s.path + "/")
    );
  };

  return (
    <div className="flex items-start justify-center px-8 py-4">
      <div className="flex items-start gap-0 w-full max-w-xl">
        {PHASES.map((phase, index) => {
          const isCompleted = index < currentPhaseIndex;
          const isCurrent = index === currentPhaseIndex;
          const isLast = index === PHASES.length - 1;
          const subStepIdx = currentSubStepIndex(index);
          const showSubSteps = isCurrent && phase.subSteps.length > 1;

          return (
            <div key={phase.id} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                {/* Phase circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCompleted ? "bg-[#4ABACD]" : isCurrent ? "bg-[#141414] ring-2 ring-[#4ABACD] ring-offset-2" : "bg-gray-200"}`}
                >
                  {isCompleted && <CheckIcon />}
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {/* Phase label */}
                <span
                  className={`text-[11px] font-medium whitespace-nowrap transition-colors duration-300
                    ${isCompleted ? "text-[#4ABACD]" : isCurrent ? "text-[#141414]" : "text-gray-400"}`}
                >
                  {phase.label}
                </span>

                {/* Sub-step dots — only for active multi-step phases */}
                {showSubSteps && (
                  <div className="flex items-center gap-1 mt-0.5">
                    {phase.subSteps.map((_, i) => {
                      const isDone = i < subStepIdx;
                      const isActive = i === subStepIdx;
                      return (
                        <div
                          key={i}
                          className={`rounded-full transition-all duration-300
                            ${isDone ? "w-2 h-2 bg-[#4ABACD]" : isActive ? "w-2.5 h-2.5 bg-[#141414]" : "w-2 h-2 bg-gray-300"}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className="flex-1 h-[1.5px] mx-2 mt-3 transition-colors duration-300"
                  style={{ backgroundColor: isCompleted ? "#4ABACD" : "#E5E7EB" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
