import { Suspense, useCallback, useMemo, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Navbar from "../../common/Header/Navbar";
import BottomHeader from "../../common/Header/BottomHeader";
import Footer from "../../common/Footer/Footer";
import PageLoader from "../../components/ui/PageLoader";
import CompareTray from "../../components/ui/CompareTray";

// Pages that were not redesigned as full-width layouts get a padded container.
const contained = ["/notification", "/privacy-policy", "/verify", "/home-division"];
const noFooter = ["/login", "/register", "/checkout"];

const MainLayout = () => {
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFiltersState] = useState({ divisionId: "", cityId: "" });

  const setFilters = useCallback((divisionId = "", cityId = "") => setFiltersState({ divisionId, cityId }), []);

  const context = useMemo(
    () => ({ searchQuery, setSearchQuery, ...filters, setFilters }),
    [searchQuery, filters, setFilters]
  );

  const isHome = pathname === "/";
  const isContained = contained.some((p) => pathname.startsWith(p));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className={`flex-1 ${isHome ? "" : "pt-[72px]"} ${isContained ? "container-x py-8 pb-28 lg:pb-12" : ""}`}>
        <Suspense fallback={<PageLoader />}>
          <Outlet context={context} />
        </Suspense>
      </main>
      {!noFooter.includes(pathname) && <Footer />}
      <CompareTray />
      <BottomHeader />
      <ScrollRestoration />
    </div>
  );
};

export default MainLayout;
