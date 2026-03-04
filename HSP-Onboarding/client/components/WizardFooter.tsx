import { Button, ChevronLeft, ChevronRight } from "design-system/components";

interface WizardFooterProps {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  /** Primary button label (default: "Save and continue") */
  nextLabel?: string;
}

export default function WizardFooter({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Save and continue",
}: WizardFooterProps) {
  return (
    <footer className="flex w-full shrink-0 items-center justify-between border-t border-[#CAD6E2] bg-white px-6 py-4">
      <Button variant="secondary" onClick={onBack}>
        <ChevronLeft />
        Back
      </Button>
      <Button
        variant="primary"
        onClick={onNext}
        disabled={nextDisabled}
      >
        {nextLabel}
        <ChevronRight />
      </Button>
    </footer>
  );
}
