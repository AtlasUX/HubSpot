import { ReactNode } from "react";
import { IconButton } from "../IconButton";
import { CloseIcon } from "../icons";

export interface ModalProps {
  /** Whether the modal is open */
  open?: boolean;
  /** Called when the overlay is clicked (e.g. to close) */
  onOverlayClick?: () => void;
  /** Modal content */
  children: ReactNode;
  className?: string;
}

export interface ModalHeaderProps {
  /** Title text */
  title?: string;
  /** Called when close button is clicked */
  onClose?: () => void;
  /** Custom header content (overrides title when provided) */
  children?: ReactNode;
  className?: string;
}

export interface ModalBodyProps {
  /** Body content */
  children?: ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  /** Footer content (e.g. buttons) */
  children: ReactNode;
  className?: string;
}

function ModalHeader({
  title = "Header title here",
  onClose,
  children,
  className = "",
}: ModalHeaderProps) {
  return (
    <div
      className={`flex justify-between items-center gap-0 self-stretch h-[68px] min-h-[68px] rounded-t-[var(--borderRadius-transitional-floating)] border border-[var(--color-border-container-default)] bg-[var(--Modal-Gradient)] pl-[var(--space-1000)] pr-[var(--space-400)] ${className}`}
    >
      {children ?? (
        <>
          <span className="heading-300">{title}</span>
          {onClose && (
            <IconButton onClick={onClose} aria-label="Close" className="shrink-0 text-[var(--color-text-inverse-default)]">
              <CloseIcon />
            </IconButton>
          )}
        </>
      )}
    </div>
  );
}

function ModalBody({
  children,
  className = "",
}: ModalBodyProps) {
  return (
    <div
      className={`flex flex-col items-start self-stretch border-x border-[var(--color-border-container-default)] bg-[var(--color-fill-surface-default)] pt-[var(--space-600)] px-[var(--space-1000)] ${className}`}
    >
      {children ?? (
        <p className="body-100 text-hs-obsidian">
          This is default content inside a dialog... or you can create your own
          content components and do an instance swap between this component and
          the content component you create locally.
        </p>
      )}
    </div>
  );
}

function ModalFooter({
  children,
  className = "",
}: ModalFooterProps) {
  return (
    <div
      className={`flex flex-col items-start self-stretch rounded-b-[var(--borderRadius-transitional-floating)] border-x border-b border-[var(--color-border-container-default)] bg-[var(--color-fill-surface-default)] py-[var(--space-600)] px-[var(--space-1000)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Modal({
  open = true,
  onOverlayClick,
  children,
  className = "",
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onOverlayClick}
        onKeyDown={(e) => e.key === "Escape" && onOverlayClick?.()}
        aria-hidden="true"
      />
      {/* Modal content */}
      <div
        className={`relative min-w-[400px] max-w-[90vw] w-full max-h-[90vh] overflow-hidden flex flex-col rounded-[var(--borderRadius-transitional-floating)] shadow-xl bg-[var(--color-fill-surface-default)] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
