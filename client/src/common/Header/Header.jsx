import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Dropdown, Menu, Input, Badge, AutoComplete } from "antd";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import {
  logout,
  useCurrentToken,
  useCurrentUser,
} from "../../redux/Feature/auth/authSlice";
import { IoChevronDownCircleOutline, IoSearch } from "react-icons/io5";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { IoArrowBack } from "react-icons/io5";
import image from "../../assets/icon.png";
import Adjustment from "../Adjustment/Adjustment";
import { useState, useEffect, useRef } from "react";
import Division from "../../Pages/Division/Division";
import { useGetUserNotificationsQuery } from "../../redux/Feature/Admin/notification/notificationApi";
import {
  BellIcon,
  BellIcon as BellIconOutline,
} from "@heroicons/react/24/outline"; 

const Header = ({ onSearch, onFilterChange }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const isNotificationPage = location.pathname === "/notification";
  const isAdminLogin = location.pathname === "/admin-login";
  const isDivision = location?.pathname === "/division";
  const isDetails = location?.pathname?.startsWith("/hotel");
  const isDistrict = location?.pathname?.startsWith("/district");
  const isArea = location?.pathname?.startsWith("/area");
  const [isSearchOverlay, setIsSearchOverlay] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRight, setVisibleRight] = useState(false);
  const [divisionId, setDivisionId] = useState("");
  const [cityId, setCityId] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const {
    data: notifications
  } = useGetUserNotificationsQuery(user?.id);
  
  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications?.data?.filter((n) => !n.isRead).length);
    }
  }, [notifications]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save searches to localStorage
  const saveSearch = (query) => {
    if (!query.trim()) return;

    const updatedSearches = [
      query,
      ...recentSearches.filter((s) => s !== query),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You are successfully logged out.");
    navigate("/login");
  };

  const handleSearchChange = (value) => {
    onSearch(value);
    setSearchQuery(value);
  };

   const handleMobileSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value);
    setSearchQuery(value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      onSearch(searchQuery);
      setIsSearchOverlay(false)
    }
  };

  const handleApplyFilters = (division, city) => {
    setDivisionId(division);
    setCityId(city);
    onFilterChange(division, city);
  };

  const getActiveClass = (path) =>
    location.pathname === path
      ? "!text-white !font-bold"
      : "text-[#ecf0f1] hover:text-white transition-all duration-300";

  const userMenu = (
    <Menu>
      <Menu.Item
        key="booking-history"
        className={getActiveClass(
          token && user?.role === "user" ? "/user/user-booking" : ""
        )}
        onClick={() =>
          navigate(token && user?.role === "user" ? "/user/user-booking" : "")
        }
      >
        {token && user?.role === "user" ? "Booking History" : ""}
      </Menu.Item>

      <Menu.Item
        key="profile"
        className={getActiveClass(
          token && user?.role === "user" ? "/user/user-profile" : ""
        )}
        onClick={() =>
          navigate(token && user?.role === "user" ? "/user/user-profile" : "")
        }
      >
        {token && user?.role === "user" ? "Edit Profile" : ""}
      </Menu.Item>

      <Menu.Item
        key="logout"
        className="text-red-400 font-bold"
        onClick={handleLogout}
      >
        Sign Out
      </Menu.Item>
    </Menu>
  );

  // Prepare autocomplete options from recent searches
  const autoCompleteOptions = recentSearches.map(search => ({
    value: search,
    label: (
      <div key={search} className="flex items-center">
        <IoSearch className="text-gray-400 mr-2" size={14} />
        <span>{search}</span>
      </div>
    )
  }));

  return (
    <>
      <div
        className={`py-3 lg:py-1 px-4 lg:px-5 mb-3 bg-[#3498db] shadow-sm border-b border-gray-200 ${
          isNotificationPage ||
          isAdminLogin ||
          isDetails ||
          isDivision ||
          isDistrict ||
          isArea ||
          location?.pathname === "/login" ||
          location?.pathname === "/register"
            ? "hidden"
            : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Left Side - Logo/User */}
          <div className="flex justify-between items-center gap-x-1">
            <Link to={"/"}>
              <div className="">
                <img src={image} className="w-20 h-20  object-contain" alt="" />
              </div>
            </Link>
            <div className="lg:hidden">
              <p className="text-[12px] font-bold text-white">
                {user?.name || "Hello Guest"}
              </p>
              <p className="text-[10px] text-white">Where are you going?</p>
            </div>
          </div>

          {/* Center - Search Bar with AutoComplete */}
          <div className="flex-1 mx-4 hidden lg:block">
            <div className="relative w-full max-w-md mx-auto flex items-center gap-2">
              <AutoComplete
                value={searchQuery}
                onChange={handleSearchChange}
                onSelect={(value) => {
                  setSearchQuery(value);
                  onSearch(value);
                }}
                options={autoCompleteOptions}
                placeholder="Search hotels..."
                className="w-full"
                filterOption={(inputValue, option) =>
                  option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                allowClear
                prefix={<IoSearch className="text-gray-400" />}
/>
              <button
                onClick={() => setVisibleRight(true)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <HiOutlineAdjustmentsHorizontal
                  className="text-gray-600"
                  size={15}
                />
              </button>
            </div>
          </div>

          {/* Right Side - Auth/Links */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block mt-2">
             <Link to={"/notification"}>
               <Badge
                count={unreadCount}
                overflowCount={9}
                className="cursor-pointer"
              >
                <BellIcon className="text-xl w-6 h-6 text-white" />
              </Badge>
             </Link>
            </div>
            {token ? (
              <div className="flex items-center gap-2">
                <div className="items-center gap-2 hidden lg:flex">
                  <Dropdown overlay={userMenu} trigger={["click"]}>
                    <Button className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 lg:ml-auto text-secondary">
                      {user?.name}
                      <IoChevronDownCircleOutline className="h-4 w-4 transition-transform" />
                    </Button>
                  </Dropdown>
                </div>
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 lg:ml-auto text-red-500 bg-white hover:bg-gray-100 transition-all duration-300 text-[12px] md:text-base lg:hidden"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="text-[#ecf0f1] flex items-center gap-2">
                <div className="flex gap-1 text-[12px] md:text-base">
                  <Link to="/login" className={getActiveClass("/login")}>
                    <span className="">Login</span>
                  </Link>{" "}
                  /
                  <Link to="/register" className={getActiveClass("/register")}>
                    <span className="">Register</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 lg:hidden">
          <div className="relative w-full">
            <Input
              placeholder="Search hotels..."
              value={searchQuery}
              onFocus={() => setIsSearchOverlay(true)}
              prefix={<IoSearch className="text-gray-400" />}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Mobile Filter Panel */}
        <Adjustment
          visibleRight={visibleRight}
          setVisibleRight={setVisibleRight}
          selectedDivision={divisionId}
          setSelectedDivision={setDivisionId}
          selectedCity={cityId}
          setSelectedCity={setCityId}
          onApplyFilters={handleApplyFilters}
        />
      </div>

      {/* Mobile Search Overlay - Keeps existing functionality */}
      {isSearchOverlay && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col h-full lg:hidden">
          {/* Search Header */}
          <div className="sticky top-0 bg-white p-4 border-b shadow-sm z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOverlay(false)}
                className="text-gray-600"
              >
                <IoArrowBack size={24} />
              </button>
              <Input
                autoFocus
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={handleMobileSearchChange}
                onPressEnter={handleSearchSubmit}
                prefix={<IoSearch className="text-gray-400" />}
                className="rounded-full w-full"
                suffix={
                  searchQuery ? (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        onSearch("");
                      }}
                      className="text-gray-400"
                    >
                      ✖
                    </button>
                  ) : null
                }
              />
              <button
                onClick={() => setVisibleRight(true)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <HiOutlineAdjustmentsHorizontal
                  className="text-gray-600"
                  size={20}
                />
              </button>
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Recent Searches
                  </h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSearchQuery(search);
                        onSearch(search);
                        setIsSearchOverlay(false);
                      }}
                    >
                      <IoSearch className="text-gray-400 mr-2" />
                      <span>{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Divisions */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Browse by Division
              </h3>
              <Division onDivisionClick={() => setIsSearchOverlay(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;