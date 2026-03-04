import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Gallery = lazy(() => import("design-system/gallery").then((m) => ({ default: m.Gallery })));
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import GeneralInformation from "./pages/GeneralInformation";
import BusinessType from "./pages/BusinessType";
import BusinessInformation from "./pages/BusinessInformation";
import BusinessAddressAndSupport from "./pages/BusinessAddressAndSupport";
import BusinessFinancials from "./pages/BusinessFinancials";
import BusinessRepresentative from "./pages/BusinessRepresentative";
import Owners from "./pages/Owners";
import ReviewAndFinish from "./pages/ReviewAndFinish";

export default function App() {
  return (
    <BrowserRouter>
      <OnboardingProvider>
        <Routes>
        <Route path="/" element={<GeneralInformation />} />
        <Route path="/general-information" element={<GeneralInformation />} />
        <Route path="/business-type" element={<BusinessType />} />
        <Route path="/business-information" element={<BusinessInformation />} />
        <Route path="/business-address-and-support" element={<BusinessAddressAndSupport />} />
        <Route path="/business-financials" element={<BusinessFinancials />} />
        <Route path="/business-representative" element={<BusinessRepresentative />} />
        <Route path="/owners" element={<Owners />} />
        <Route path="/review-and-finish" element={<ReviewAndFinish />} />
        <Route path="/design-system" element={<Suspense fallback={<div className="p-8">Loading...</div>}><Gallery /></Suspense>} />
        </Routes>
      </OnboardingProvider>
    </BrowserRouter>
  );
}
