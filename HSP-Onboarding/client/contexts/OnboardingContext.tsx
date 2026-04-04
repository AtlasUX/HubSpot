import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface InviteRecord {
  id: string;
  email: string;
  sections: string[];
  sentAt: string;
  status: "active" | "revoked";
}

export type BusinessTypeOption = "individual" | "nonprofit" | "company";

export type BusinessStructureOption =
  | "sole-proprietorship"
  | "single-member-llc"
  | "multi-member-llc"
  | "private-partnership"
  | "private-corporation"
  | "other";

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  phoneCountryCode: string;
  ssn: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  /** "rep" = same address as the representative, an owner id = same as that owner, null = manually entered */
  sameAddressAs: "rep" | string | null;
}

export interface OnboardingState {
  country: string;
  email: string;
  selectedBusinessType: BusinessTypeOption | null;
  /** Only used when selectedBusinessType is "company" */
  businessStructure: BusinessStructureOption | null;
  /** True after user confirms business type in the modal (locked/read-only on return) */
  hasConfirmedBusinessType: boolean;
  legalBusinessName: string;
  doingBusinessAs: string;
  industry: string;
  productsOrServices: string;
  businessPhone: string;
  businessPhoneCountryCode: string;
  businessAddressStreet: string;
  businessAddressStreetLine2: string;
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
  businessWebsite: string;
  contactEmail: string;
  supportEmail: string;
  supportPhone: string;
  supportPhoneCountryCode: string;
  /** How long has your company been in business? (e.g. "3-5 years") */
  timeInBusiness: string;
  /** Average transaction amount (e.g. "$5,000 or more") */
  averageTransactionAmount: string;
  /** Monthly transaction volume (e.g. "$50,000 or less") */
  monthlyTransactionVolume: string;
  /** Employer Identification Number (EIN) - stored, displayed masked */
  ein: string;
  /** Bank statement description (e.g. "OPERATING NAME(S)") */
  bankStatementDescription: string;
  /** Business representative first name */
  repFirstName: string;
  /** Business representative last name */
  repLastName: string;
  /** Business representative email */
  repEmail: string;
  /** Business representative job title */
  repJobTitle: string;
  /** Business representative date of birth (e.g. "January 1, 1989") */
  repDateOfBirth: string;
  /** Representative home address */
  repAddressStreet: string;
  repAddressCity: string;
  repAddressState: string;
  repAddressZip: string;
  repAddressCountry: string;
  /** Representative phone */
  repPhone: string;
  repPhoneCountryCode: string;
  /** Last 4 digits of SSN - stored, displayed masked as **** */
  repSsnLast4: string;
  /** Whether the representative is also a 25%+ owner */
  repIsOwner: boolean;
  /** Additional owners (25%+ stake) beyond the representative if repIsOwner is true */
  owners: Owner[];
  /** Sent invites */
  invites: InviteRecord[];
}

interface OnboardingContextValue extends OnboardingState {
  setCountry: (country: string) => void;
  setEmail: (email: string) => void;
  setSelectedBusinessType: (type: BusinessTypeOption | null) => void;
  setBusinessStructure: (structure: BusinessStructureOption | null) => void;
  setHasConfirmedBusinessType: (v: boolean) => void;
  /** Reset all onboarding data to initial state */
  resetOnboarding: () => void;
  setLegalBusinessName: (v: string) => void;
  setDoingBusinessAs: (v: string) => void;
  setIndustry: (v: string) => void;
  setProductsOrServices: (v: string) => void;
  setBusinessPhone: (v: string) => void;
  setBusinessPhoneCountryCode: (v: string) => void;
  setBusinessAddressStreet: (v: string) => void;
  setBusinessAddressStreetLine2: (v: string) => void;
  setBusinessAddressCity: (v: string) => void;
  setBusinessAddressState: (v: string) => void;
  setBusinessAddressZip: (v: string) => void;
  setBusinessWebsite: (v: string) => void;
  setContactEmail: (v: string) => void;
  setSupportEmail: (v: string) => void;
  setSupportPhone: (v: string) => void;
  setSupportPhoneCountryCode: (v: string) => void;
  setTimeInBusiness: (v: string) => void;
  setAverageTransactionAmount: (v: string) => void;
  setMonthlyTransactionVolume: (v: string) => void;
  setEin: (v: string) => void;
  setBankStatementDescription: (v: string) => void;
  setRepFirstName: (v: string) => void;
  setRepLastName: (v: string) => void;
  setRepEmail: (v: string) => void;
  setRepJobTitle: (v: string) => void;
  setRepDateOfBirth: (v: string) => void;
  setRepAddressStreet: (v: string) => void;
  setRepAddressCity: (v: string) => void;
  setRepAddressState: (v: string) => void;
  setRepAddressZip: (v: string) => void;
  setRepAddressCountry: (v: string) => void;
  setRepPhone: (v: string) => void;
  setRepPhoneCountryCode: (v: string) => void;
  setRepSsnLast4: (v: string) => void;
  setRepIsOwner: (v: boolean) => void;
  setOwners: (owners: Owner[]) => void;
  addInvite: (email: string, sections: string[]) => void;
  revokeInvite: (id: string) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<BusinessTypeOption | null>(null);
  const [businessStructure, setBusinessStructure] =
    useState<BusinessStructureOption | null>(null);
  const [hasConfirmedBusinessType, setHasConfirmedBusinessType] = useState(false);
  const [legalBusinessName, setLegalBusinessName] = useState("");
  const [doingBusinessAs, setDoingBusinessAs] = useState("");
  const [industry, setIndustry] = useState("");
  const [productsOrServices, setProductsOrServices] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessPhoneCountryCode, setBusinessPhoneCountryCode] = useState("US");
  const [businessAddressStreet, setBusinessAddressStreet] = useState("");
  const [businessAddressStreetLine2, setBusinessAddressStreetLine2] = useState("");
  const [businessAddressCity, setBusinessAddressCity] = useState("");
  const [businessAddressState, setBusinessAddressState] = useState("");
  const [businessAddressZip, setBusinessAddressZip] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [supportPhoneCountryCode, setSupportPhoneCountryCode] = useState("US");
  const [timeInBusiness, setTimeInBusiness] = useState("");
  const [averageTransactionAmount, setAverageTransactionAmount] = useState("");
  const [monthlyTransactionVolume, setMonthlyTransactionVolume] = useState("");
  const [ein, setEin] = useState("");
  const [bankStatementDescription, setBankStatementDescription] = useState("");
  const [repFirstName, setRepFirstName] = useState("");
  const [repLastName, setRepLastName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [repJobTitle, setRepJobTitle] = useState("");
  const [repDateOfBirth, setRepDateOfBirth] = useState("");
  const [repAddressStreet, setRepAddressStreet] = useState("");
  const [repAddressCity, setRepAddressCity] = useState("");
  const [repAddressState, setRepAddressState] = useState("");
  const [repAddressZip, setRepAddressZip] = useState("");
  const [repAddressCountry, setRepAddressCountry] = useState("");
  const [repPhone, setRepPhone] = useState("");
  const [repPhoneCountryCode, setRepPhoneCountryCode] = useState("US");
  const [repSsnLast4, setRepSsnLast4] = useState("");
  const [repIsOwner, setRepIsOwner] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [invites, setInvites] = useState<InviteRecord[]>([]);

  const addInvite = (email: string, sections: string[]) => {
    const record: InviteRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email,
      sections,
      sentAt: new Date().toISOString(),
      status: "active",
    };
    setInvites((prev) => [record, ...prev]);
  };

  const revokeInvite = (id: string) => {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "revoked" } : inv))
    );
  };

  const resetOnboarding = () => {
    setCountry("");
    setEmail("");
    setSelectedBusinessType(null);
    setBusinessStructure(null);
    setHasConfirmedBusinessType(false);
    setLegalBusinessName("");
    setDoingBusinessAs("");
    setIndustry("");
    setProductsOrServices("");
    setBusinessPhone("");
    setBusinessPhoneCountryCode("US");
    setBusinessAddressStreet("");
    setBusinessAddressStreetLine2("");
    setBusinessAddressCity("");
    setBusinessAddressState("");
    setBusinessAddressZip("");
    setBusinessWebsite("");
    setContactEmail("");
    setSupportEmail("");
    setSupportPhoneCountryCode("US");
    setTimeInBusiness("");
    setAverageTransactionAmount("");
    setMonthlyTransactionVolume("");
    setEin("");
    setBankStatementDescription("");
    setRepFirstName("");
    setRepLastName("");
    setRepEmail("");
    setRepJobTitle("");
    setRepDateOfBirth("");
    setRepAddressStreet("");
    setRepAddressCity("");
    setRepAddressState("");
    setRepAddressZip("");
    setRepAddressCountry("");
    setRepPhone("");
    setRepPhoneCountryCode("US");
    setRepSsnLast4("");
    setRepIsOwner(false);
    setOwners([]);
  };

  return (
    <OnboardingContext.Provider
      value={{
        country,
        setCountry,
        email,
        setEmail,
        selectedBusinessType,
        setSelectedBusinessType,
        businessStructure,
        setBusinessStructure,
        hasConfirmedBusinessType,
        setHasConfirmedBusinessType,
        resetOnboarding,
        legalBusinessName,
        setLegalBusinessName,
        doingBusinessAs,
        setDoingBusinessAs,
        industry,
        setIndustry,
        productsOrServices,
        setProductsOrServices,
        businessPhone,
        setBusinessPhone,
        businessPhoneCountryCode,
        setBusinessPhoneCountryCode,
        businessAddressStreet,
        setBusinessAddressStreet,
        businessAddressStreetLine2,
        setBusinessAddressStreetLine2,
        businessAddressCity,
        setBusinessAddressCity,
        businessAddressState,
        setBusinessAddressState,
        businessAddressZip,
        setBusinessAddressZip,
        businessWebsite,
        setBusinessWebsite,
        contactEmail,
        setContactEmail,
        supportEmail,
        setSupportEmail,
        supportPhone,
        setSupportPhone,
        supportPhoneCountryCode,
        setSupportPhoneCountryCode,
        timeInBusiness,
        setTimeInBusiness,
        averageTransactionAmount,
        setAverageTransactionAmount,
        monthlyTransactionVolume,
        setMonthlyTransactionVolume,
        ein,
        setEin,
        bankStatementDescription,
        setBankStatementDescription,
        repFirstName,
        setRepFirstName,
        repLastName,
        setRepLastName,
        repEmail,
        setRepEmail,
        repJobTitle,
        setRepJobTitle,
        repDateOfBirth,
        setRepDateOfBirth,
        repAddressStreet,
        setRepAddressStreet,
        repAddressCity,
        setRepAddressCity,
        repAddressState,
        setRepAddressState,
        repAddressZip,
        setRepAddressZip,
        repAddressCountry,
        setRepAddressCountry,
        repPhone,
        setRepPhone,
        repPhoneCountryCode,
        setRepPhoneCountryCode,
        repSsnLast4,
        setRepSsnLast4,
        repIsOwner,
        setRepIsOwner,
        owners,
        setOwners,
        invites,
        addInvite,
        revokeInvite,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return ctx;
}
