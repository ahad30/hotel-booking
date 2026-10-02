import React from "react";
import Dropdown from "./Dropdown";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const Navbar = ({
  setIsSidebarOpen,
  isSidebarOpen,
}) => {
  return (
    <>
      <div className="border-gray-200 px-4 lg:px-6 py-1 bg-[#121c34]">
        <div className="flex justify-between items-center lg:order-2 sticky z-40 top-0">
          <div>
            {isSidebarOpen === false && (
              <button
                className="lg:hidden"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                <IoIosArrowDroprightCircle size={25} className="text-white" />
              </button>
            )}

            <p className="text-[#E0E0E0] hidden lg:block">Hotel Universe</p>
          </div>
          {/* profile */}
          <div>
            <Dropdown/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
