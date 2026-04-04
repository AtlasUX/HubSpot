export type RestrictionStatus = "prohibited" | "restricted" | null;

export interface Industry {
  value: string;
  label: string;
  group: string;
  irsCode?: string;
  restriction: RestrictionStatus;
  restrictionReason?: string;
  approvalRequirements?: string[];
}

export const INDUSTRIES: Industry[] = [
  // Agriculture & Food
  { value: "crop-farming", label: "Crop farming & agriculture", group: "Agriculture & Food", irsCode: "111", restriction: null },
  { value: "animal-farming", label: "Animal farming & livestock", group: "Agriculture & Food", irsCode: "112", restriction: null },
  { value: "food-manufacturing", label: "Food & beverage manufacturing", group: "Agriculture & Food", irsCode: "311", restriction: null },
  { value: "restaurants", label: "Restaurants & food service", group: "Agriculture & Food", irsCode: "722", restriction: null },
  { value: "grocery-retail", label: "Grocery & specialty food retail", group: "Agriculture & Food", irsCode: "445", restriction: null },
  { value: "alcohol-retail", label: "Alcohol & liquor retail", group: "Agriculture & Food", irsCode: "4453", restriction: "restricted", restrictionReason: "Alcohol sales require prior written approval and are subject to additional review.", approvalRequirements: ["State alcohol retail license or permit", "Liquor license number", "Age verification policy (how you confirm buyers are 21+)"] },
  { value: "cannabis", label: "Cannabis & marijuana dispensary", group: "Agriculture & Food", irsCode: "4599", restriction: "prohibited", restrictionReason: "Cannabis and marijuana businesses, including dispensaries and related products, are prohibited from using HubSpot Payments regardless of local legality." },

  // Construction & Real Estate
  { value: "general-contracting", label: "General contracting & construction", group: "Construction & Real Estate", irsCode: "236", restriction: null },
  { value: "specialty-trade", label: "Specialty trade contractors (plumbing, electrical, HVAC)", group: "Construction & Real Estate", irsCode: "238", restriction: null },
  { value: "real-estate-services", label: "Real estate services & brokerage", group: "Construction & Real Estate", irsCode: "531", restriction: null },
  { value: "property-management", label: "Property management", group: "Construction & Real Estate", irsCode: "5311", restriction: null },
  { value: "home-improvement", label: "Home improvement & renovation", group: "Construction & Real Estate", irsCode: "2361", restriction: null },

  // Technology
  { value: "software-dev", label: "Software development & programming", group: "Technology", irsCode: "5415", restriction: null },
  { value: "computer-systems", label: "Computer systems design & integration", group: "Technology", irsCode: "5415", restriction: null },
  { value: "it-services", label: "IT services & technical support", group: "Technology", irsCode: "5415", restriction: null },
  { value: "data-analytics", label: "Data processing & analytics", group: "Technology", irsCode: "5182", restriction: null },
  { value: "ecommerce", label: "E-commerce & online retail", group: "Technology", irsCode: "454", restriction: null },
  { value: "saas", label: "SaaS & software subscriptions", group: "Technology", irsCode: "5415", restriction: null },
  { value: "crypto-exchange", label: "Cryptocurrency exchange or wallet", group: "Technology", irsCode: "523", restriction: "prohibited", restrictionReason: "Cryptocurrency exchanges and wallets are prohibited from using HubSpot Payments." },
  { value: "nft", label: "NFT marketplace (secondary sales)", group: "Technology", irsCode: "523", restriction: "prohibited", restrictionReason: "Secondary NFT sales are prohibited from using HubSpot Payments." },

  // Professional Services
  { value: "legal-services", label: "Legal services", group: "Professional Services", irsCode: "5411", restriction: null },
  { value: "accounting", label: "Accounting & tax preparation", group: "Professional Services", irsCode: "5412", restriction: null },
  { value: "management-consulting", label: "Management & business consulting", group: "Professional Services", irsCode: "5416", restriction: null },
  { value: "marketing-advertising", label: "Marketing & advertising", group: "Professional Services", irsCode: "5418", restriction: null },
  { value: "architecture-engineering", label: "Architecture & engineering", group: "Professional Services", irsCode: "5413", restriction: null },
  { value: "research-development", label: "Research & development", group: "Professional Services", irsCode: "5417", restriction: null },
  { value: "hr-staffing", label: "HR & staffing services", group: "Professional Services", irsCode: "5613", restriction: null },
  { value: "debt-collection", label: "Debt collection agency", group: "Professional Services", irsCode: "5614", restriction: "prohibited", restrictionReason: "Debt collection agencies are prohibited from using HubSpot Payments." },
  { value: "credit-repair", label: "Credit repair or counseling", group: "Professional Services", irsCode: "5614", restriction: "prohibited", restrictionReason: "Credit repair and counseling services are prohibited from using HubSpot Payments." },

  // Healthcare
  { value: "medical-dental", label: "Medical & dental practice", group: "Healthcare", irsCode: "621", restriction: null },
  { value: "mental-health", label: "Mental health & therapy services", group: "Healthcare", irsCode: "6213", restriction: null },
  { value: "physical-therapy", label: "Physical therapy & rehabilitation", group: "Healthcare", irsCode: "6213", restriction: null },
  { value: "veterinary", label: "Veterinary services", group: "Healthcare", irsCode: "5419", restriction: null },
  { value: "wellness-fitness", label: "Wellness, fitness & personal training", group: "Healthcare", irsCode: "7139", restriction: null },
  { value: "pharmaceuticals", label: "Online pharmacy or prescription products", group: "Healthcare", irsCode: "4461", restriction: "restricted", restrictionReason: "Online pharmacies and prescription products require prior written approval and additional documentation.", approvalRequirements: ["State pharmacy license", "DEA registration number (if dispensing controlled substances)", "Prescription validation process documentation", "HIPAA compliance statement"] },
  { value: "telemedicine", label: "Telemedicine & telehealth", group: "Healthcare", irsCode: "621", restriction: "restricted", restrictionReason: "Telemedicine services require prior written approval.", approvalRequirements: ["State medical license(s) for each state you operate in", "HIPAA compliance documentation", "Telehealth platform security overview"] },
  { value: "supplements", label: "Vitamins, supplements & nutraceuticals", group: "Healthcare", irsCode: "4461", restriction: "restricted", restrictionReason: "Supplements and nutraceuticals making health claims require prior review and approval.", approvalRequirements: ["Third-party lab test results (Certificate of Analysis)", "List of health claims used in marketing", "FTC/FDA compliance statement", "Product ingredient list"] },

  // Retail
  { value: "general-retail", label: "General merchandise & retail", group: "Retail", irsCode: "452", restriction: null },
  { value: "clothing-apparel", label: "Clothing & apparel", group: "Retail", irsCode: "448", restriction: null },
  { value: "electronics-retail", label: "Electronics & computer equipment", group: "Retail", irsCode: "443", restriction: null },
  { value: "home-goods", label: "Home goods & furniture", group: "Retail", irsCode: "442", restriction: null },
  { value: "sporting-goods", label: "Sporting goods & hobbies", group: "Retail", irsCode: "451", restriction: null },
  { value: "auto-parts", label: "Auto parts & accessories", group: "Retail", irsCode: "4411", restriction: null },
  { value: "firearms-retail", label: "Firearms & weapons (licensed dealer)", group: "Retail", irsCode: "4591", restriction: "restricted", restrictionReason: "Licensed firearms dealers require prior written approval from HubSpot.", approvalRequirements: ["Federal Firearms License (FFL) number", "State dealer license", "Age verification policy (how you confirm buyers are 21+)", "Copy of your FFL certificate"] },
  { value: "tobacco", label: "Tobacco, e-cigarettes & vaping products", group: "Retail", irsCode: "4599", restriction: "restricted", restrictionReason: "Tobacco and vaping products require prior written approval.", approvalRequirements: ["State retail tobacco license", "Age verification policy", "List of products sold"] },
  { value: "cbd", label: "CBD & hemp products", group: "Retail", irsCode: "4599", restriction: "restricted", restrictionReason: "CBD products require prior written approval and must comply with local THC limits.", approvalRequirements: ["Certificate of Analysis (COA) showing THC content <0.3%", "State hemp retailer license", "Lab test results for each product line", "Sourcing documentation (US-grown hemp)"] },
  { value: "adult-content", label: "Adult content or entertainment", group: "Retail", irsCode: "5129", restriction: "prohibited", restrictionReason: "Adult content, escort services, and related businesses are prohibited from using HubSpot Payments." },

  // Finance & Insurance
  { value: "insurance", label: "Insurance services & brokerage", group: "Finance & Insurance", irsCode: "524", restriction: "restricted", restrictionReason: "Insurance businesses require prior written approval.", approvalRequirements: ["State insurance license(s)", "National Producer Number (NPN)", "Lines of authority (health, life, P&C, etc.)", "E&O insurance documentation"] },
  { value: "investment", label: "Investment & financial advisory", group: "Finance & Insurance", irsCode: "523", restriction: "restricted", restrictionReason: "Investment and brokerage services require prior written approval.", approvalRequirements: ["SEC or FINRA registration number", "State investment advisor license", "Form ADV (Part 1 or Part 2)", "Description of services and fee structure"] },
  { value: "lending", label: "Lending & credit services", group: "Finance & Insurance", irsCode: "522", restriction: "restricted", restrictionReason: "Lending and credit services require prior written approval.", approvalRequirements: ["State lending license(s)", "NMLS ID number", "Truth in Lending Act compliance statement", "Description of loan products offered"] },
  { value: "money-transmission", label: "Money transmission or remittance", group: "Finance & Insurance", irsCode: "5223", restriction: "prohibited", restrictionReason: "Peer-to-peer money transmission and remittance services are prohibited." },

  // Arts, Media & Entertainment
  { value: "photography-video", label: "Photography & video production", group: "Arts & Entertainment", irsCode: "5419", restriction: null },
  { value: "music-performing", label: "Music, performing arts & events", group: "Arts & Entertainment", irsCode: "711", restriction: null },
  { value: "graphic-design", label: "Graphic design & creative services", group: "Arts & Entertainment", irsCode: "5414", restriction: null },
  { value: "event-planning", label: "Event planning & management", group: "Arts & Entertainment", irsCode: "7113", restriction: null },
  { value: "publishing", label: "Publishing, blogging & content creation", group: "Arts & Entertainment", irsCode: "511", restriction: null },
  { value: "gambling", label: "Gambling, casinos or sweepstakes", group: "Arts & Entertainment", irsCode: "713", restriction: "prohibited", restrictionReason: "Gambling, casino games, fantasy sports with prizes, lotteries, and sweepstakes are prohibited from using HubSpot Payments." },
  { value: "dating-services", label: "Dating & matchmaking services", group: "Arts & Entertainment", irsCode: "8129", restriction: "restricted", restrictionReason: "Dating and matchmaking services require prior written approval.", approvalRequirements: ["Age verification system documentation", "Content moderation policy", "Terms of service for users"] },

  // Education
  { value: "k12-education", label: "K-12 education & tutoring", group: "Education", irsCode: "611", restriction: null },
  { value: "higher-education", label: "Colleges & universities", group: "Education", irsCode: "611", restriction: null },
  { value: "professional-training", label: "Professional training & certification", group: "Education", irsCode: "6116", restriction: null },
  { value: "online-courses", label: "Online courses & e-learning", group: "Education", irsCode: "6116", restriction: null },
  { value: "coaching", label: "Business & life coaching", group: "Education", irsCode: "6116", restriction: null },

  // Transportation & Logistics
  { value: "freight-shipping", label: "Freight, shipping & logistics", group: "Transportation & Logistics", irsCode: "484", restriction: null },
  { value: "moving-services", label: "Moving & relocation services", group: "Transportation & Logistics", irsCode: "4841", restriction: null },
  { value: "rideshare-taxi", label: "Rideshare & taxi services", group: "Transportation & Logistics", irsCode: "485", restriction: null },
  { value: "airline", label: "Commercial airline or charter flights", group: "Transportation & Logistics", irsCode: "481", restriction: "prohibited", restrictionReason: "Commercial and charter airline operations are prohibited from using HubSpot Payments." },
  { value: "cruise", label: "Cruise line operations", group: "Transportation & Logistics", irsCode: "483", restriction: "prohibited", restrictionReason: "Commercial cruise operations are prohibited from using HubSpot Payments." },
  { value: "travel-agency", label: "Travel agency & booking services", group: "Transportation & Logistics", irsCode: "5615", restriction: "restricted", restrictionReason: "Travel reservation services require prior written approval due to elevated financial risk.", approvalRequirements: ["IATA or ARC accreditation number (if applicable)", "Seller of Travel license (required in CA, FL, HI, WA)", "Refund and cancellation policy", "Chargeback dispute management process"] },

  // Personal & Home Services
  { value: "personal-care", label: "Personal care, salons & beauty services", group: "Personal & Home Services", irsCode: "8121", restriction: null },
  { value: "cleaning-services", label: "Cleaning & janitorial services", group: "Personal & Home Services", irsCode: "5617", restriction: null },
  { value: "landscaping", label: "Landscaping & lawn care", group: "Personal & Home Services", irsCode: "5629", restriction: null },
  { value: "childcare", label: "Childcare & daycare", group: "Personal & Home Services", irsCode: "6244", restriction: null },
  { value: "pet-services", label: "Pet services & grooming", group: "Personal & Home Services", irsCode: "8129", restriction: null },
  { value: "repair-services", label: "Appliance & electronics repair", group: "Personal & Home Services", irsCode: "811", restriction: null },

  // Nonprofit & Other
  { value: "nonprofit-charity", label: "Nonprofit & charitable organization", group: "Nonprofit & Other", irsCode: "813", restriction: null },
  { value: "religious-org", label: "Religious organization or church", group: "Nonprofit & Other", irsCode: "8131", restriction: null },
  { value: "wholesale", label: "Wholesale trade & distribution", group: "Nonprofit & Other", irsCode: "42", restriction: null },
  { value: "manufacturing", label: "Manufacturing & industrial", group: "Nonprofit & Other", irsCode: "31", restriction: null },
  { value: "other", label: "Other (not listed)", group: "Nonprofit & Other", irsCode: "9999", restriction: null },
];

export const RESTRICTED_KEYWORDS = [
  { pattern: /\b(adult|porn|xxx|escort|prostitut|strip club|sex work)\b/i, status: "prohibited" as const, reason: "Adult content and escort services are prohibited." },
  { pattern: /\b(cannabis|marijuana|weed|dispensary|THC)\b/i, status: "prohibited" as const, reason: "Cannabis and marijuana businesses are prohibited." },
  { pattern: /\b(gambling|casino|lottery|slot|betting|wager)\b/i, status: "prohibited" as const, reason: "Gambling and casino operations are prohibited." },
  { pattern: /\b(pyramid|multi-level marketing|MLM|get rich)\b/i, status: "prohibited" as const, reason: "Pyramid schemes and MLM businesses are prohibited." },
  { pattern: /\b(crypto|bitcoin|ethereum|NFT|blockchain exchange)\b/i, status: "prohibited" as const, reason: "Cryptocurrency exchanges are prohibited." },
  { pattern: /\b(gun|firearm|weapon|ammunition|ammo)\b/i, status: "restricted" as const, reason: "Firearms-related businesses require prior written approval." },
  { pattern: /\b(CBD|hemp|vap|e-cig|tobacco)\b/i, status: "restricted" as const, reason: "CBD, hemp, and tobacco products require prior written approval." },
  { pattern: /\b(prescription|pharmacy|pharma|drug)\b/i, status: "restricted" as const, reason: "Pharmaceutical and prescription products require prior written approval." },
];

export function getDescriptionRestriction(description: string): { status: RestrictionStatus; reason: string } | null {
  for (const { pattern, status, reason } of RESTRICTED_KEYWORDS) {
    if (pattern.test(description)) {
      return { status, reason };
    }
  }
  return null;
}
