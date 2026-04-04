import { Modal, Button } from "design-system/components";
import type { BusinessStructureOption } from "@/contexts/OnboardingContext";

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  individual: "Individual",
  nonprofit: "Nonprofit",
  company: "Company",
};

const BUSINESS_STRUCTURE_LABELS: Record<string, string> = {
  individual: "Sole proprietor",
  nonprofit: "Nonprofit organization",
  "sole-proprietorship": "Sole proprietorship",
  "single-member-llc": "Single-member LLC",
  "multi-member-llc": "Multi-member LLC",
  "private-partnership": "Private partnership",
  "private-corporation": "Private corporation",
  other: "Other/I'm not sure",
};

function getBusinessStructureLabel(
  businessType: "individual" | "nonprofit" | "company",
  businessStructure: BusinessStructureOption | null
): string {
  if (businessType === "individual") return BUSINESS_STRUCTURE_LABELS.individual;
  if (businessType === "nonprofit") return BUSINESS_STRUCTURE_LABELS.nonprofit;
  if (businessType === "company" && businessStructure) {
    return BUSINESS_STRUCTURE_LABELS[businessStructure] ?? businessStructure;
  }
  return "—";
}

interface ConfirmBusinessTypeModalProps {
  open: boolean;
  businessType: "individual" | "nonprofit" | "company";
  businessStructure?: BusinessStructureOption | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmBusinessTypeModal({
  open,
  businessType,
  businessStructure = null,
  onConfirm,
  onCancel,
}: ConfirmBusinessTypeModalProps) {
  return (
    <Modal open={open} onOverlayClick={onCancel} className="!w-[550px] !max-w-[550px] !min-w-[550px]">
      <Modal.Header
        title="Confirm your business type"
        onClose={onCancel}
      />
      <Modal.Body>
        <div className="flex flex-col items-start gap-[var(--space-600)]">
          <p className="body-100 text-hs-obsidian">
            Please review your selection carefully.{" "}
            <strong className="font-semibold">Once you continue, it can only be changed by restarting the application.</strong>
          </p>
          <div
            className="flex flex-col items-start gap-[10px] self-stretch rounded-[var(--borderRadius-300)] p-[var(--space-400)] bg-[var(--color-fill-primary-disabled)]"
          >
            <div className="flex justify-between items-start w-full">
              <span className="body-100 text-hs-obsidian">Business Type</span>
              <span className="body-125 text-hs-obsidian font-semibold">
                {BUSINESS_TYPE_LABELS[businessType]}
              </span>
            </div>
            {businessType === "company" && businessStructure && (
              <div className="flex justify-between items-start w-full">
                <span className="body-100 text-hs-obsidian">Business Structure</span>
                <span className="body-125 text-hs-obsidian font-semibold">
                  {getBusinessStructureLabel(businessType, businessStructure)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-[var(--space-300)]">
          <Button variant="primary" onClick={onConfirm}>
            Yes, this is correct
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
