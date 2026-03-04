import { useState } from "react";
import { Modal, Button, TextField } from "design-system/components";

const CONFIRMATION_TEXT = "RESTART";

interface RestartApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RestartApplicationModal({
  open,
  onClose,
  onConfirm,
}: RestartApplicationModalProps) {
  const [confirmInput, setConfirmInput] = useState("");
  const [attemptedWithoutConfirm, setAttemptedWithoutConfirm] = useState(false);
  const isConfirmEnabled = confirmInput.trim() === CONFIRMATION_TEXT;
  const hasWrongInput = confirmInput.length > 0 && confirmInput.trim() !== CONFIRMATION_TEXT;

  const fieldError = attemptedWithoutConfirm
    ? "Confirmation is required"
    : hasWrongInput
      ? "Type RESTART to confirm. Entry is case sensitive"
      : undefined;

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      setConfirmInput("");
      setAttemptedWithoutConfirm(false);
      onConfirm();
    } else {
      setAttemptedWithoutConfirm(true);
    }
  };

  const handleClose = () => {
    setConfirmInput("");
    setAttemptedWithoutConfirm(false);
    onClose();
  };

  return (
    <Modal open={open} onOverlayClick={handleClose} className="!w-[550px] !max-w-[550px] !min-w-[550px]">
      <Modal.Header title="Restart Application" onClose={handleClose} />
      <Modal.Body className="pb-[var(--space-300)]">
        <div className="flex flex-col items-start gap-[var(--space-600)]">
          <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on]">
            Restarting will permanently delete all information you've entered in your HubSpot Payments application.
          </p>
          <TextField
            label="To confirm, type RESTART below"
            value={confirmInput}
            onChange={(v) => {
              setConfirmInput(v);
              setAttemptedWithoutConfirm(false);
            }}
            placeholder="Type RESTART to confirm"
            fullWidth
            required
            error={fieldError}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-[var(--space-300)]">
          <div className="relative shrink-0">
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!isConfirmEnabled}
            >
              Restart application
            </Button>
            {!isConfirmEnabled && (
              <div
                className="absolute inset-0 z-10 cursor-not-allowed rounded-[var(--borderRadius-100)]"
                onClick={() => setAttemptedWithoutConfirm(true)}
                aria-hidden="true"
              />
            )}
          </div>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
