import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type BusinessTypeOption = "individual" | "nonprofit" | "company";

export type BusinessStructureOption =
  | "sole-proprietorship"
  | "single-member-llc"
  | "multi-member-llc"
  | "private-partnership"
  | "private-corporation"
  | "other";

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
  businessAddressCity: string;
  businessAddressState: string;
  businessAddressZip: string;
  businessWebsite: string;
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
  /** Owner first name */
  ownerFirstName: string;
  /** Owner last name */
  ownerLastName: string;
  /** Owner email */
  ownerEmail: string;
  /** Owner job title */
  ownerJobTitle: string;
  /** Owner date of birth */
  ownerDateOfBirth: string;
  /** Owner home address */
  ownerAddressStreet: string;
  ownerAddressCity: string;
  ownerAddressState: string;
  ownerAddressZip: string;
  ownerAddressCountry: string;
  /** Owner phone */
  ownerPhone: string;
  ownerPhoneCountryCode: string;
  /** Owner last 4 digits of SSN - stored, displayed masked as **** */
  ownerSsnLast4: string;
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
  setBusinessAddressCity: (v: string) => void;
  setBusinessAddressState: (v: string) => void;
  setBusinessAddressZip: (v: string) => void;
  setBusinessWebsite: (v: string) => void;
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
  setOwnerFirstName: (v: string) => void;
  setOwnerLastName: (v: string) => void;
  setOwnerEmail: (v: string) => void;
  setOwnerJobTitle: (v: string) => void;
  setOwnerDateOfBirth: (v: string) => void;
  setOwnerAddressStreet: (v: string) => void;
  setOwnerAddressCity: (v: string) => void;
  setOwnerAddressState: (v: string) => void;
  setOwnerAddressZip: (v: string) => void;
  setOwnerAddressCountry: (v: string) => void;
  setOwnerPhone: (v: string) => void;
  setOwnerPhoneCountryCode: (v: string) => void;
  setOwnerSsnLast4: (v: string) => void;
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
  const [businessAddressCity, setBusinessAddressCity] = useState("");
  const [businessAddressState, setBusinessAddressState] = useState("");
  const [businessAddressZip, setBusinessAddressZip] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
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
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerJobTitle, setOwnerJobTitle] = useState("");
  const [ownerDateOfBirth, setOwnerDateOfBirth] = useState("");
  const [ownerAddressStreet, setOwnerAddressStreet] = useState("");
  const [ownerAddressCity, setOwnerAddressCity] = useState("");
  const [ownerAddressState, setOwnerAddressState] = useState("");
  const [ownerAddressZip, setOwnerAddressZip] = useState("");
  const [ownerAddressCountry, setOwnerAddressCountry] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerPhoneCountryCode, setOwnerPhoneCountryCode] = useState("US");
  const [ownerSsnLast4, setOwnerSsnLast4] = useState("");

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
    setBusinessAddressCity("");
    setBusinessAddressState("");
    setBusinessAddressZip("");
    setBusinessWebsite("");
    setSupportEmail("");
    setSupportPhone("");
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
    setOwnerFirstName("");
    setOwnerLastName("");
    setOwnerEmail("");
    setOwnerJobTitle("");
    setOwnerDateOfBirth("");
    setOwnerAddressStreet("");
    setOwnerAddressCity("");
    setOwnerAddressState("");
    setOwnerAddressZip("");
    setOwnerAddressCountry("");
    setOwnerPhone("");
    setOwnerPhoneCountryCode("US");
    setOwnerSsnLast4("");
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
        businessAddressCity,
        setBusinessAddressCity,
        businessAddressState,
        setBusinessAddressState,
        businessAddressZip,
        setBusinessAddressZip,
        businessWebsite,
        setBusinessWebsite,
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
        ownerFirstName,
        setOwnerFirstName,
        ownerLastName,
        setOwnerLastName,
        ownerEmail,
        setOwnerEmail,
        ownerJobTitle,
        setOwnerJobTitle,
        ownerDateOfBirth,
        setOwnerDateOfBirth,
        ownerAddressStreet,
        setOwnerAddressStreet,
        ownerAddressCity,
        setOwnerAddressCity,
        ownerAddressState,
        setOwnerAddressState,
        ownerAddressZip,
        setOwnerAddressZip,
        ownerAddressCountry,
        setOwnerAddressCountry,
        ownerPhone,
        setOwnerPhone,
        ownerPhoneCountryCode,
        setOwnerPhoneCountryCode,
        ownerSsnLast4,
        setOwnerSsnLast4,
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
