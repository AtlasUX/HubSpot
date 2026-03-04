import { useNavigate } from "react-router-dom";
import { OnboardingNav, type NavItem } from "design-system/components";
import { useOnboarding } from "@/contexts/OnboardingContext";

type CurrentStep =
  | "general-information"
  | "business-type"
  | "business-information"
  | "business-address-and-support"
  | "business-financials"
  | "business-representative"
  | "owners"
  | "review-and-finish";

function buildNavItems(
  currentStep: CurrentStep,
  isGeneralInfoCompleted: boolean
): NavItem[] {
  const isOnGeneralInfo = currentStep === "general-information";
  const isOnBusinessType = currentStep === "business-type";
  const isOnBusinessInfo = currentStep === "business-information";
  const isOnBusinessAddress = currentStep === "business-address-and-support";
  const isOnBusinessFinancials = currentStep === "business-financials";
  const isOnBusinessRepresentative = currentStep === "business-representative";
  const isOnOwners = currentStep === "owners";
  const isOnReview = currentStep === "review-and-finish";

  return [
    { type: "section-completed", label: "Processor Selection" },
    {
      type: isGeneralInfoCompleted ? "section-completed" : "section",
      label: "General information",
      current: isOnGeneralInfo,
      path: "/general-information",
    },
    { type: "section", label: "Verify your business" },
    {
      type: isOnBusinessInfo ? "section-completed" : "substep",
      label: "Business type",
      current: isOnBusinessType,
      path: "/business-type",
    },
    {
      type: "substep",
      label: "Business information",
      current: isOnBusinessInfo,
      path: "/business-information",
    },
    {
      type: "substep",
      label: "Business address & support",
      current: isOnBusinessAddress,
      path: "/business-address-and-support",
    },
    {
      type: "substep",
      label: "Business financials",
      current: isOnBusinessFinancials,
      path: "/business-financials",
    },
    { type: "section", label: "Personal information" },
    {
      type: "substep",
      label: "Business representative",
      current: isOnBusinessRepresentative,
      path: "/business-representative",
    },
    {
      type: "substep",
      label: "Owners",
      current: isOnOwners,
      path: "/owners",
    },
    {
      type: "section",
      label: "Review & finish",
      current: isOnReview,
      path: "/review-and-finish",
    },
  ];
}

interface WizardSidebarProps {
  currentStep?: CurrentStep;
}

export default function WizardSidebar({ currentStep = "business-type" }: WizardSidebarProps) {
  const navigate = useNavigate();
  const { country } = useOnboarding();
  const isGeneralInfoCompleted = !!country;
  const navItems = buildNavItems(currentStep, isGeneralInfoCompleted);
  return <OnboardingNav items={navItems} onItemClick={(path) => navigate(path)} />;
}
