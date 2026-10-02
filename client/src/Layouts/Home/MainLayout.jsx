import { Outlet, useLocation } from "react-router-dom";
import Header from "../../common/Header/Header";
import BottomHeader from "../../common/Header/BottomHeader";
import { useState } from "react";

const MainLayout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [cityId, setCityId] = useState('');

  return (
    <div>
      <Header
        onSearch={setSearchQuery}
        onFilterChange={(division, city) => {
          setDivisionId(division);
          setCityId(city);
        }}
      />

      <div className={`w-[95%] lg:max-w-[1480px] mx-auto ${["/cancel", "/success", "/checkout"].includes(location.pathname) ? "w-full" : ""}`}>
        <Outlet context={{ searchQuery, divisionId, cityId }} />
      </div>

      <BottomHeader />
    </div>
  );
};

export default MainLayout;
