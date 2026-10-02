import { Link, useLocation } from "react-router-dom";
import { CustomerRoutes } from "../../Routes/Customer.Routes";
import { sidebarGenerator } from "../../utils/sidebarGenerator";
import { FiMenu, FiX } from "react-icons/fi";


const CustomerDashboardSidebar = ({isSidebarOpen, toggleSidebar}) => {
  const sidebarData = sidebarGenerator(CustomerRoutes);
  // console.log(sidebarData)
  const { pathname } = useLocation();
  // console.log(pathname);
  return (
    <div className="bg-white w-72 rounded-md py-3 shadow-2xl">
      {/* thi div contains image and user name */}
      <div className="">
     <div className="flex justify-end">
     <button
              className="xl:hidden mb-4 lg:mb-0"
              onClick={toggleSidebar}
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen && <FiX size={24} />}
            </button>
     </div>
        {/* <div className="mb-5  flex flex-col justify-center items-center">
          <img
            className="w-40 h-40 rounded-full"
            src="https://i.ibb.co/NLpp7vt/depositphotos-176214104-stock-illustration-default-avatar-profile-icon.webp"
            alt=""
          />
          <h1 className="text-[#265edd] font-medium text-[20px]">
            Sabiha Wasema
          </h1>
        </div> */}
        {/* sidebar data */}
        <div>
          {sidebarData.map((item) => {
            return (
              <Link to={item.key} key={item.key} className="">
                <div
                  className={`flex items-center hover:border-x-4 border-blue-500 duration-100 gap-x-3 px-7 py-1 text-sm hover:bg-gray-200 ${
                    pathname === item.key
                      ? " bg-gray-200 border-x-4 border-blue-500"
                      : ""
                  }`}
                >
                  <span className="py-2">{item?.icon}</span>
                  <span className="py-2">{item?.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardSidebar;
