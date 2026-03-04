import { useState, useEffect } from "react";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { RadioCard } from "../components/RadioCard";
import {
  OnboardingNav,
  OnboardingNavItem,
  type NavItem,
} from "../components/OnboardingNav";
import { Div } from "../components/Div";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, CloseIcon, HubspotLogo, InfoIcon } from "../components/icons";
import { IconButton } from "../components/IconButton";
import { OnboardingHeader } from "../components/OnboardingHeader";
import { Modal } from "../components/Modal";
import { Select } from "../components/Select";
import { TextField } from "../components/TextField";
import { PhoneNumber } from "../components/PhoneNumber";
import { OnboardingTooltip } from "../components/OnboardingTooltip";
import { Toast } from "../components/Toast";

/**
 * Design System Gallery
 * View and interact with all design system components and their states.
 */
interface GalleryNavItem {
  id: string;
  label: string;
  keywords?: string[];
}

interface GalleryNavSection {
  id?: string;
  label: string;
  keywords?: string[];
  children?: GalleryNavItem[];
}

const SECTIONS: (GalleryNavItem | GalleryNavSection)[] = [
  { id: "toast-and-alerts", label: "Toast & Alerts", keywords: ["toast", "alert", "notification", "warning", "info", "banner", "success", "feedback"] },
  { id: "buttons", label: "Buttons", keywords: ["button", "primary", "secondary", "ghost"] },
  { id: "cards", label: "Cards", keywords: ["card", "radio", "radio card", "business type"] },
  { id: "colors", label: "Colors", keywords: ["colors", "obsidian", "lorax", "calypso"] },
  { id: "icons", label: "Icons", keywords: ["icons", "chevron", "chevron-left", "chevron-right", "chevron-up", "chevron-down", "hubspot-logo", "info", "info-icon"] },
  { id: "inputs", label: "Inputs", keywords: ["input", "form", "field", "select", "dropdown"] },
  {
    label: "Headers",
    children: [
      { id: "onboarding-header", label: "Payments Onboarding Header", keywords: ["header", "logo", "exit"] },
    ],
  },
  {
    label: "Navigation",
    children: [
      { id: "onboarding-nav", label: "Payments Onboarding Left Nav", keywords: ["nav", "navigation", "steps", "sidebar", "left nav"] },
    ],
  },
  { id: "modal", label: "Modal", keywords: ["modal", "dialog", "overlay", "popup"] },
  { id: "spacing", label: "Spacing", keywords: ["spacing", "space", "units", "gap", "padding", "margin"] },
  { id: "tooltips", label: "Onboarding Tooltips", keywords: ["tooltip", "onboarding tooltip", "info", "contextual help", "right column"] },
  { id: "typography", label: "Typography", keywords: ["typography", "font", "heading", "body", "heading-400", "body-125", "body-100"] },
];

function getAllSectionIds(): string[] {
  const ids: string[] = [];
  for (const s of SECTIONS) {
    if ("children" in s && s.children) {
      for (const c of s.children) ids.push(c.id);
    } else if ("id" in s && s.id) {
      ids.push(s.id);
    }
  }
  return ids;
}

function getFilteredSections(sections: (GalleryNavItem | GalleryNavSection)[], query: string): (GalleryNavItem | GalleryNavSection)[] {
  if (!query.trim()) return sections;
  const q = query.toLowerCase();
  const match = (item: { label: string; keywords?: string[] }) =>
    item.label.toLowerCase().includes(q) ||
    (item.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false);
  return sections
    .map((s) => {
      if ("children" in s && s.children) {
        const matchedChildren = s.children.filter((c) => match(c));
        if (matchedChildren.length > 0 || match({ label: s.label, keywords: s.keywords })) {
          return { ...s, children: matchedChildren.length > 0 ? matchedChildren : s.children };
        }
        return null;
      }
      return match(s as NavItem) ? s : null;
    })
    .filter((s): s is GalleryNavItem | GalleryNavSection => s !== null);
}

const SPACING_UNITS: [number, string][] = [
  [0, "0px"],
  [25, "1px"],
  [50, "2px"],
  [100, "4px"],
  [200, "8px"],
  [250, "10px"],
  [300, "12px"],
  [400, "16px"],
  [500, "20px"],
  [600, "24px"],
  [700, "28px"],
  [800, "32px"],
  [900, "36px"],
  [1000, "40px"],
  [1100, "48px"],
  [1200, "56px"],
  [1300, "60px"],
  [1400, "64px"],
  [1500, "96px"],
  [1600, "144px"],
  [1700, "192px"],
];

export function Gallery() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | null>(null);
  const allSectionIds = getAllSectionIds();
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (typeof window === "undefined") return "buttons";
    const hash = window.location.hash?.slice(1);
    if (hash === "tokens") return "colors";
    if (hash === "alert" || hash === "toast") return "toast-and-alerts";
    return hash && allSectionIds.includes(hash) ? hash : "buttons";
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = getFilteredSections(SECTIONS, searchQuery);

  const getSectionIds = (sections: (GalleryNavItem | GalleryNavSection)[]): string[] => {
    const ids: string[] = [];
    for (const s of sections) {
      if ("children" in s && s.children) {
        for (const c of s.children) ids.push(c.id);
      } else if ("id" in s && s.id) {
        ids.push(s.id);
      }
    }
    return ids;
  };

  const getFirstSectionId = (sections: (GalleryNavItem | GalleryNavSection)[]): string | null => {
    const ids = getSectionIds(sections);
    return ids[0] ?? null;
  };

  const filteredIds = getSectionIds(filteredSections);

  // When search filters out the active section, switch to first match
  useEffect(() => {
    const firstId = getFirstSectionId(filteredSections);
    if (filteredSections.length > 0 && firstId && !filteredIds.includes(activeSection)) {
      setActiveSection(firstId);
      window.history.pushState(null, "", `#${firstId}`);
    }
  }, [searchQuery, filteredSections, activeSection, filteredIds]);

  const isActiveSection = (id: string) => activeSection === id;

  const setSection = (id: string) => {
    setActiveSection(id);
    window.history.pushState(null, "", `#${id}`);
  };

  useEffect(() => {
    const handler = () => {
      let hash = window.location.hash?.slice(1);
      if (hash === "tokens") hash = "colors";
      if (hash === "alert" || hash === "toast") hash = "toast-and-alerts";
      if (hash && allSectionIds.includes(hash)) setActiveSection(hash);
    };
    window.addEventListener("hashchange", handler);
    let hash = window.location.hash?.slice(1);
    if (hash === "tokens") hash = "colors";
    if (hash === "alert" || hash === "toast") hash = "toast-and-alerts";
    if (hash && allSectionIds.includes(hash)) setActiveSection(hash);
    return () => window.removeEventListener("hashchange", handler);
  }, [allSectionIds]);

  const onboardingNavItems: NavItem[] = [
    { type: "section-completed", label: "Processor Selection" },
    { type: "section-completed", label: "General information" },
    { type: "section", label: "Verify your business" },
    { type: "substep", label: "Business type", current: true },
    { type: "substep", label: "Business information" },
    { type: "substep", label: "Business address & support" },
    { type: "substep", label: "Business financials" },
    { type: "section", label: "Personal information" },
    { type: "substep", label: "Business representative" },
    { type: "substep", label: "Owners" },
    { type: "section", label: "Review & finish" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Gallery Header */}
      <header className="sticky top-0 z-10 border-b border-hs-great-white bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-hs-obsidian">
          Design System Gallery
        </h1>
        <p className="mt-1 text-sm text-hs-text-subtle">
          Source of truth for Payments Acquisition components
        </p>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-56 shrink-0 border-r border-hs-great-white py-6">
          <div className="px-4 pb-4">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-hs-great-white bg-white px-3 py-2 text-sm text-hs-obsidian placeholder:text-hs-text-subtle focus:border-hs-focus focus:outline-none focus:ring-2 focus:ring-hs-focus"
              aria-label="Search design system"
            />
          </div>
          <nav className="space-y-1 px-4">
            {filteredSections.length === 0 ? (
              <p className="px-3 py-2 text-sm text-hs-text-subtle">
                No matches for &quot;{searchQuery}&quot;
              </p>
            ) : (
              filteredSections.map((section) =>
                "children" in section && section.children ? (
                  <div key={section.label} className="space-y-0.5">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-hs-text-subtle">
                      {section.label}
                    </div>
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setSection(child.id)}
                        className={`block w-full rounded-sm px-3 py-2 pl-5 text-left text-sm font-medium transition-colors ${
                          isActiveSection(child.id)
                            ? "bg-hs-great-white text-hs-lorax"
                            : "text-hs-obsidian hover:bg-hs-great-white"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    key={(section as GalleryNavItem).id}
                    onClick={() => setSection((section as GalleryNavItem).id)}
                    className={`block w-full rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isActiveSection((section as GalleryNavItem).id)
                        ? "bg-hs-great-white text-hs-lorax"
                        : "text-hs-obsidian hover:bg-hs-great-white"
                    }`}
                  >
                    {(section as GalleryNavItem).label}
                  </button>
                )
              )
            )}
          </nav>
        </aside>

        {/* Content Area - only show active section */}
        <main className="flex-1 overflow-auto p-8">
          {activeSection === "buttons" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Buttons
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Buttons communicate what action will occur when the user interacts with them.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Properties
                </h3>
                <div className="rounded-sm border border-hs-great-white p-4 text-sm">
                  <dl className="space-y-2">
                    <div className="flex gap-4">
                      <dt className="font-medium text-hs-obsidian w-24">use</dt>
                      <dd className="text-hs-text-subtle">primary · secondary · ghost</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-medium text-hs-obsidian w-24">size</dt>
                      <dd className="text-hs-text-subtle">small · medium · large</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-medium text-hs-obsidian w-24">State</dt>
                      <dd className="text-hs-text-subtle">idle · hover · pressed · focus · disabled</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-medium text-hs-obsidian w-24">Text</dt>
                      <dd className="text-hs-text-subtle">Button label (e.g. Save and continue)</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-medium text-hs-obsidian w-24">Lead Icon</dt>
                      <dd className="text-hs-text-subtle">Optional icon before text</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-medium text-hs-obsidian w-24">Trail Icon</dt>
                      <dd className="text-hs-text-subtle">Optional icon after text (e.g. chevron)</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    use
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    size
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    State
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button>idle</Button>
                    <Button disabled>disabled</Button>
                  </div>
                  <p className="mt-2 text-xs text-hs-text-subtle">
                    hover, pressed, and focus are interactive states—hover or tab to the button to see them.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    Lead icon
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">
                      <ChevronLeft />
                      Back
                    </Button>
                    <Button variant="secondary">
                      <ChevronLeft />
                      Back
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    Trail icon
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">
                      Save and continue
                      <ChevronRight />
                    </Button>
                    <Button variant="secondary">
                      Continue
                      <ChevronRight />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    Icon button
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <IconButton aria-label="Close">
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "toast-and-alerts" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Toast & Alerts
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Toast: transient notification with close button, auto-dismisses. Alert: in-page banner for warnings, info, and general messages.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Alert – Warning (default)
                </h3>
                <Alert
                  type="warning"
                  title
                  titleText="Your business type can't be changed after this step."
                  text="If you need to update it, you'll have to restart this application. Not sure? Check your registration documents or consult your accountant before continuing."
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Alert – Warning (no title)
                </h3>
                <Alert
                  type="warning"
                  title={false}
                  text="If you need to update it, you'll have to restart this application."
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Alert – Info
                </h3>
                <Alert
                  type="info"
                  title
                  titleText="Information"
                  text="This is an informational message."
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Alert – Closeable
                </h3>
                <Alert
                  type="warning"
                  title
                  titleText="Dismissible alert"
                  text="This alert can be closed."
                  closeable
                  onClose={() => {}}
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Toast – Success
                </h3>
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-[var(--space-400)] px-[var(--space-600)] py-[var(--space-400)] rounded-[var(--borderRadius-transitional-component,4px)] border border-[var(--color-border-positive-default,#00823A)] bg-[var(--color-fill-positive-subtle,#EDF4EF)] shadow-lg max-w-2xl">
                    <p className="body-100 text-hs-obsidian [font-feature-settings:'ss01'_on] flex-1">
                      Your HubSpot payments application has been successfully reset
                    </p>
                    <CloseIcon className="shrink-0 text-hs-obsidian" />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setToastVariant("success")}
                  >
                    Show toast
                  </Button>
                </div>
              </div>

              {toastVariant === "success" && (
                <Toast
                  variant="success"
                  message="Your HubSpot payments application has been successfully reset"
                  onClose={() => setToastVariant(null)}
                />
              )}
            </section>
          )}

          {activeSection === "onboarding-header" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Payments Onboarding Header
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Header for onboarding flows – logo left, Exit link right
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Default
                </h3>
                <div className="overflow-hidden rounded-sm border border-hs-great-white">
                  <OnboardingHeader onExit={() => {}} />
                </div>
              </div>
            </section>
          )}

          {activeSection === "onboarding-nav" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Payments Onboarding Left Nav
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Step indicator for multi-step onboarding flows
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    Nav item states
                  </h3>
                  <div className="space-y-4 rounded-sm border border-hs-great-white p-6 bg-white">
                    <div>
                      <p className="mb-2 text-xs font-medium text-hs-text-subtle uppercase tracking-wide">
                        Section completed
                      </p>
                      <OnboardingNavItem
                        variant="section-completed"
                        label="Processor Selection"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-hs-text-subtle uppercase tracking-wide">
                        Section (default)
                      </p>
                      <OnboardingNavItem
                        variant="section"
                        label="Verify your business"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-hs-text-subtle uppercase tracking-wide">
                        Section (active, no substeps)
                      </p>
                      <OnboardingNavItem
                        variant="section"
                        label="General information"
                        active
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-hs-text-subtle uppercase tracking-wide">
                        Substep (default)
                      </p>
                      <OnboardingNavItem
                        variant="substep"
                        label="Business information"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium text-hs-text-subtle uppercase tracking-wide">
                        Substep (active)
                      </p>
                      <OnboardingNavItem
                        variant="substep"
                        label="Business type"
                        active
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    Full nav (example)
                  </h3>
                  <div className="rounded-sm border border-hs-great-white p-6 bg-white">
                    <OnboardingNav items={onboardingNavItems} />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "modal" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Modal
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Dialog with header, content area, and footer.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Example
                </h3>
                <div className="max-w-md overflow-hidden rounded-[var(--borderRadius-transitional-floating)] border border-hs-great-white shadow-lg">
                  <Modal.Header title="Header title here" onClose={() => {}} />
                  <Modal.Body />
                  <Modal.Footer>
                    <div className="flex gap-[var(--space-300)]">
                      <Button variant="primary">Button</Button>
                      <Button variant="secondary">Button</Button>
                    </div>
                  </Modal.Footer>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Interactive
                </h3>
                <Button onClick={() => setModalOpen(true)}>Open modal</Button>
                <Modal
                  open={modalOpen}
                  onOverlayClick={() => setModalOpen(false)}
                >
                  <Modal.Header title="Header title here" onClose={() => setModalOpen(false)} />
                  <Modal.Body />
                  <Modal.Footer>
                    <div className="flex gap-[var(--space-300)]">
                      <Button variant="primary">Button</Button>
                      <Button variant="secondary">Button</Button>
                    </div>
                  </Modal.Footer>
                </Modal>
              </div>
            </section>
          )}

          {activeSection === "cards" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Radio Card
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Selectable card used as a radio button option
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    Default
                  </h3>
                  <div className="max-w-xl">
                    <RadioCard
                      title="Individual"
                      description="E.g. a small side business that is not incorporated, independent consultant, contractor, or freelancer"
                      icon={
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M11.0071 11.6497C12.2214 11.6497 13.3286 12.3288 13.8929 13.4145C14.0784 13.7644 13.9427 14.1928 13.5929 14.3785C13.4858 14.4356 13.3714 14.4573 13.2644 14.4573V14.4643C13.0072 14.4643 12.7568 14.3214 12.6282 14.0785C12.3068 13.4644 11.6856 13.086 11.0071 13.0859C10.3285 13.0859 9.70675 13.4643 9.38532 14.0785C9.20673 14.4285 8.77129 14.5642 8.42132 14.3785C8.07136 14.1999 7.93575 13.7645 8.12137 13.4145C8.68566 12.3288 9.79283 11.6497 11.0071 11.6497Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.0071 5.17858C12.3857 5.17858 13.5071 6.3 13.5071 7.67858C13.5071 9.05715 12.3857 10.1786 11.0071 10.1786C9.62854 10.1786 8.50712 9.05715 8.50712 7.67858C8.50712 6.3 9.62854 5.17858 11.0071 5.17858ZM11.0071 6.60715C10.4143 6.60715 9.93569 7.08572 9.93569 7.67858C9.93569 8.27143 10.4143 8.75001 11.0071 8.75001C11.6 8.75001 12.0785 8.27143 12.0785 7.67858C12.0785 7.08572 11.6 6.60715 11.0071 6.60715Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.8927 1.60715C17.0713 1.60715 18.0356 2.57143 18.0356 3.75V16.6071C18.0356 17.7857 17.0713 18.75 15.8927 18.75H5.89272C4.71415 18.75 3.74986 17.7857 3.74986 16.6071V14.4643H3.03557C2.64272 14.4643 2.32129 14.1429 2.32129 13.75C2.32129 13.3571 2.64272 13.0357 3.03557 13.0357H3.74986V10.8929H3.03557C2.64272 10.8929 2.32129 10.5714 2.32129 10.1786C2.32129 9.78572 2.64272 9.46429 3.03557 9.46429H3.74986V7.32143H3.03557C2.64272 7.32143 2.32129 7 2.32129 6.60715C2.32129 6.21429 2.64272 5.89286 3.03557 5.89286H3.74986V3.75C3.74986 2.57143 4.71415 1.60715 5.89272 1.60715H15.8927ZM5.89272 3.03572C5.49986 3.03572 5.17843 3.35715 5.17843 3.75V5.89286H5.89272C6.28558 5.89286 6.607 6.21429 6.607 6.60715C6.607 7 6.28558 7.32143 5.89272 7.32143H5.17843V9.46429H5.89272C6.28558 9.46429 6.607 9.78572 6.607 10.1786C6.607 10.5714 6.28558 10.8929 5.89272 10.8929H5.17843V13.0357H5.89272C6.28558 13.0357 6.607 13.3571 6.607 13.75C6.607 14.1429 6.28558 14.4643 5.89272 14.4643H5.17843V16.6071C5.17843 17 5.49986 17.3214 5.89272 17.3214H15.8927C16.2856 17.3214 16.607 17 16.607 16.6071V3.75C16.607 3.35715 16.2856 3.03572 15.8927 3.03572H5.89272Z" fill="currentColor"/>
                        </svg>
                      }
                      selected={false}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    Selected
                  </h3>
                  <div className="max-w-xl">
                    <RadioCard
                      title="Individual"
                      description="E.g. a small side business that is not incorporated, independent consultant, contractor, or freelancer"
                      icon={
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M11.0071 11.6497C12.2214 11.6497 13.3286 12.3288 13.8929 13.4145C14.0784 13.7644 13.9427 14.1928 13.5929 14.3785C13.4858 14.4356 13.3714 14.4573 13.2644 14.4573V14.4643C13.0072 14.4643 12.7568 14.3214 12.6282 14.0785C12.3068 13.4644 11.6856 13.086 11.0071 13.0859C10.3285 13.0859 9.70675 13.4643 9.38532 14.0785C9.20673 14.4285 8.77129 14.5642 8.42132 14.3785C8.07136 14.1999 7.93575 13.7645 8.12137 13.4145C8.68566 12.3288 9.79283 11.6497 11.0071 11.6497Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.0071 5.17858C12.3857 5.17858 13.5071 6.3 13.5071 7.67858C13.5071 9.05715 12.3857 10.1786 11.0071 10.1786C9.62854 10.1786 8.50712 9.05715 8.50712 7.67858C8.50712 6.3 9.62854 5.17858 11.0071 5.17858ZM11.0071 6.60715C10.4143 6.60715 9.93569 7.08572 9.93569 7.67858C9.93569 8.27143 10.4143 8.75001 11.0071 8.75001C11.6 8.75001 12.0785 8.27143 12.0785 7.67858C12.0785 7.08572 11.6 6.60715 11.0071 6.60715Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.8927 1.60715C17.0713 1.60715 18.0356 2.57143 18.0356 3.75V16.6071C18.0356 17.7857 17.0713 18.75 15.8927 18.75H5.89272C4.71415 18.75 3.74986 17.7857 3.74986 16.6071V14.4643H3.03557C2.64272 14.4643 2.32129 14.1429 2.32129 13.75C2.32129 13.3571 2.64272 13.0357 3.03557 13.0357H3.74986V10.8929H3.03557C2.64272 10.8929 2.32129 10.5714 2.32129 10.1786C2.32129 9.78572 2.64272 9.46429 3.03557 9.46429H3.74986V7.32143H3.03557C2.64272 7.32143 2.32129 7 2.32129 6.60715C2.32129 6.21429 2.64272 5.89286 3.03557 5.89286H3.74986V3.75C3.74986 2.57143 4.71415 1.60715 5.89272 1.60715H15.8927ZM5.89272 3.03572C5.49986 3.03572 5.17843 3.35715 5.17843 3.75V5.89286H5.89272C6.28558 5.89286 6.607 6.21429 6.607 6.60715C6.607 7 6.28558 7.32143 5.89272 7.32143H5.17843V9.46429H5.89272C6.28558 9.46429 6.607 9.78572 6.607 10.1786C6.607 10.5714 6.28558 10.8929 5.89272 10.8929H5.17843V13.0357H5.89272C6.28558 13.0357 6.607 13.3571 6.607 13.75C6.607 14.1429 6.28558 14.4643 5.89272 14.4643H5.17843V16.6071C5.17843 17 5.49986 17.3214 5.89272 17.3214H15.8927C16.2856 17.3214 16.607 17 16.607 16.6071V3.75C16.607 3.35715 16.2856 3.03572 15.8927 3.03572H5.89272Z" fill="currentColor"/>
                        </svg>
                      }
                      selected
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    Disabled
                  </h3>
                  <div className="max-w-xl">
                    <RadioCard
                      title="Individual"
                      description="E.g. a small side business that is not incorporated, independent consultant, contractor, or freelancer"
                      icon={
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M11.0071 11.6497C12.2214 11.6497 13.3286 12.3288 13.8929 13.4145C14.0784 13.7644 13.9427 14.1928 13.5929 14.3785C13.4858 14.4356 13.3714 14.4573 13.2644 14.4573V14.4643C13.0072 14.4643 12.7568 14.3214 12.6282 14.0785C12.3068 13.4644 11.6856 13.086 11.0071 13.0859C10.3285 13.0859 9.70675 13.4643 9.38532 14.0785C9.20673 14.4285 8.77129 14.5642 8.42132 14.3785C8.07136 14.1999 7.93575 13.7645 8.12137 13.4145C8.68566 12.3288 9.79283 11.6497 11.0071 11.6497Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M11.0071 5.17858C12.3857 5.17858 13.5071 6.3 13.5071 7.67858C13.5071 9.05715 12.3857 10.1786 11.0071 10.1786C9.62854 10.1786 8.50712 9.05715 8.50712 7.67858C8.50712 6.3 9.62854 5.17858 11.0071 5.17858ZM11.0071 6.60715C10.4143 6.60715 9.93569 7.08572 9.93569 7.67858C9.93569 8.27143 10.4143 8.75001 11.0071 8.75001C11.6 8.75001 12.0785 8.27143 12.0785 7.67858C12.0785 7.08572 11.6 6.60715 11.0071 6.60715Z" fill="currentColor"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.8927 1.60715C17.0713 1.60715 18.0356 2.57143 18.0356 3.75V16.6071C18.0356 17.7857 17.0713 18.75 15.8927 18.75H5.89272C4.71415 18.75 3.74986 17.7857 3.74986 16.6071V14.4643H3.03557C2.64272 14.4643 2.32129 14.1429 2.32129 13.75C2.32129 13.3571 2.64272 13.0357 3.03557 13.0357H3.74986V10.8929H3.03557C2.64272 10.8929 2.32129 10.5714 2.32129 10.1786C2.32129 9.78572 2.64272 9.46429 3.03557 9.46429H3.74986V7.32143H3.03557C2.64272 7.32143 2.32129 7 2.32129 6.60715C2.32129 6.21429 2.64272 5.89286 3.03557 5.89286H3.74986V3.75C3.74986 2.57143 4.71415 1.60715 5.89272 1.60715H15.8927ZM5.89272 3.03572C5.49986 3.03572 5.17843 3.35715 5.17843 3.75V5.89286H5.89272C6.28558 5.89286 6.607 6.21429 6.607 6.60715C6.607 7 6.28558 7.32143 5.89272 7.32143H5.17843V9.46429H5.89272C6.28558 9.46429 6.607 9.78572 6.607 10.1786C6.607 10.5714 6.28558 10.8929 5.89272 10.8929H5.17843V13.0357H5.89272C6.28558 13.0357 6.607 13.3571 6.607 13.75C6.607 14.1429 6.28558 14.4643 5.89272 14.4643H5.17843V16.6071C5.17843 17 5.49986 17.3214 5.89272 17.3214H15.8927C16.2856 17.3214 16.607 17 16.607 16.6071V3.75C16.607 3.35715 16.2856 3.03572 15.8927 3.03572H5.89272Z" fill="currentColor"/>
                        </svg>
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "inputs" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Inputs
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Form input components
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  TextField
                </h3>
                <div className="max-w-md space-y-6">
                  <TextField
                    label="Legal business name"
                    placeholder=""
                    required
                  />
                  <TextField
                    label="With helper text"
                    placeholder="e.g. Website design and development services"
                    helperText="Use 10 or more characters."
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  PhoneNumber
                </h3>
                <div className="max-w-md space-y-6">
                  <PhoneNumber
                    label="Business phone number"
                    placeholder="(222) 232-3345"
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Select (dropdown)
                </h3>
                <div className="max-w-md space-y-6">
                  <Select
                    label="Where is your company located"
                    placeholder="Select country"
                    options={[
                      { value: "US", label: "United States", countryCode: "US" },
                      { value: "CA", label: "Canada", countryCode: "CA" },
                      { value: "GB", label: "United Kingdom", countryCode: "GB" },
                      { value: "DE", label: "Germany", countryCode: "DE" },
                    ]}
                    required
                  />
                  <Select
                    label="Simple dropdown"
                    placeholder="Select an option"
                    options={[
                      { value: "a", label: "Option A" },
                      { value: "b", label: "Option B" },
                      { value: "c", label: "Option C" },
                    ]}
                  />
                  <Select
                    label="Disabled"
                    placeholder="Select"
                    options={[{ value: "x", label: "Option" }]}
                    disabled
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === "icons" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Icons
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Icon components for use in buttons, navigation, and elsewhere
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Chevrons
                </h3>
                <p className="mb-4 text-xs text-hs-text-subtle">
                  14×14
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-hs-great-white">
                      <ChevronLeft />
                    </div>
                    <span className="text-xs text-hs-text-subtle">ChevronLeft</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-hs-great-white">
                      <ChevronRight />
                    </div>
                    <span className="text-xs text-hs-text-subtle">ChevronRight</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-hs-great-white">
                      <ChevronUp />
                    </div>
                    <span className="text-xs text-hs-text-subtle">ChevronUp</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-hs-great-white">
                      <ChevronDown />
                    </div>
                    <span className="text-xs text-hs-text-subtle">ChevronDown</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Close
                </h3>
                <p className="mb-4 text-xs text-hs-text-subtle">
                  16×16
                </p>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-hs-great-white">
                    <CloseIcon />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  hubspot-logo
                </h3>
                <p className="mb-4 text-xs text-hs-text-subtle">
                  32×32
                </p>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-hs-great-white">
                    <HubspotLogo />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Info
                </h3>
                <p className="mb-4 text-xs text-hs-text-subtle">
                  12×12 – used in tooltips
                </p>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-hs-great-white">
                    <InfoIcon />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "tooltips" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Onboarding Tooltips
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Contextual help shown in the right column when a form field with a tooltip is focused. Only one tooltip displays at a time.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Example
                </h3>
                <div className="max-w-md rounded-sm border border-hs-great-white p-6">
                  <OnboardingTooltip
                    title="Legal business classification"
                    description="If you choose 'Individual' or 'Company structured as a Single Member LLC', please be aware that your 1099K and business taxes will be reported under your personal Social Security Number (SSN). If you would like your 1099K or taxes to be reported using your business tax ID, please DO NOT select 'Individual' or 'Single Member LLC'."
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                  Properties
                </h3>
                <div className="rounded-sm border border-hs-great-white p-4 text-sm">
                  <dl className="space-y-2">
                    <div className="flex gap-4">
                      <dt className="font-medium text-hs-obsidian w-24">title</dt>
                      <dd className="text-hs-text-subtle">Bold label (body/125, font-weight 600)</dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="font-medium text-hs-obsidian w-24">description</dt>
                      <dd className="text-hs-text-subtle">Help text (body/100, font-weight 300)</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>
          )}

          {activeSection === "spacing" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Spacing
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Spacing units for padding, margin, and gap
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {SPACING_UNITS.map(([token, value]) => (
                  <div
                    key={String(token)}
                    className="flex flex-col rounded-sm border border-hs-great-white p-4"
                  >
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-sm font-medium text-hs-obsidian">
                        space-{token}
                      </span>
                      <span className="text-xs text-hs-text-subtle">
                        {value}
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-sm bg-hs-calypso-medium/30"
                      style={{ width: value }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "typography" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Typography
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Font styles and type scale
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    heading/300
                  </h3>
                  <div className="rounded-sm border border-hs-great-white p-4">
                    <p className="heading-300">
                      Header title here
                    </p>
                    <p className="mt-2 text-xs text-hs-text-subtle">
                      Lexend Deca · 20px · 600 · 24px line-height · ss01
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    heading/400
                  </h3>
                  <div className="rounded-sm border border-hs-great-white p-4">
                    <p className="heading-400">
                      Select your business type
                    </p>
                    <p className="mt-2 text-xs text-hs-text-subtle">
                      Lexend Deca · 22px · 500 · 27px line-height · ss01
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    body/125
                  </h3>
                  <div className="rounded-sm border border-hs-great-white p-4">
                    <p className="body-125 text-hs-obsidian">
                      Section default (Onboarding Nav)
                    </p>
                    <p className="mt-2 text-xs text-hs-text-subtle">
                      Lexend Deca · 14px · 600 · 24px line-height
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    body/100
                  </h3>
                  <div className="rounded-sm border border-hs-great-white p-4">
                    <p className="body-100 text-hs-obsidian">
                      Business address & support
                    </p>
                    <p className="mt-2 text-xs text-hs-text-subtle">
                      Lexend Deca · 14px · 300 · 24px line-height
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    text/link/underline
                  </h3>
                  <div className="rounded-sm border border-hs-great-white p-4 bg-[var(--Primary-Obsidian)]">
                    <a href="#" className="text-link-underline">
                      Exit
                    </a>
                    <p className="mt-2 text-xs text-hs-text-subtle text-white/80">
                      Lexend Deca · 14px · 600 · 24px line-height · underline · Accent-Olaf (#FFF)
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-medium text-hs-obsidian">
                    div
                  </h3>
                  <p className="mb-2 text-xs text-hs-text-subtle">
                    #dfe3eb
                  </p>
                  <div className="rounded-sm border border-hs-great-white p-4">
                    <Div />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "colors" && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-hs-obsidian">
                  Colors
                </h2>
                <p className="mt-1 text-sm text-hs-text-subtle">
                  Color tokens
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries({
                  obsidian: "#141414",
                  "great-white": "#DFE3EB",
                  lorax: "#FF7A59",
                  "calypso-medium": "#7FD1DE",
                  "calypso-selected-bg": "#E8F4F7",
                  "radio-checked": "#4ABACD",
                  "radio-disabled-bg": "#EAF0F6",
                  "radio-disabled-border": "#CBD6E2",
                  "fill-primary-default": "#141414",
                  "fill-secondary-default": "#FFF",
                  "border-secondary-default": "#8A8A8A",
                  "Primary-Obsidian": "#33475B",
                  "Accent-Olaf": "#FFF",
                  "Accent-Gypsum": "#F5F8FA",
                  "fill-primary-disabled": "#F5F5F5",
                  "text-primary-disabled": "#8A8A8A",
                  "text-subtle": "#6B7280",
                  "caution-border": "#F59E0B",
                  "caution-fill": "#FFFBEB",
                }).map(([name, hex]) => (
                  <div
                    key={name}
                    className="rounded-sm border border-hs-great-white p-4"
                  >
                    <div
                      className="mb-2 h-12 rounded-sm border border-hs-great-white"
                      style={{ backgroundColor: hex }}
                    />
                    <p className="text-sm font-medium text-hs-obsidian">
                      hs-{name}
                    </p>
                    <p className="text-xs text-hs-text-subtle">{hex}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
