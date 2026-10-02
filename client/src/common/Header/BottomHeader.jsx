import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  HomeIcon as HomeIconOutline, 
  BellIcon as BellIconOutline, 
  UserIcon as UserIconOutline,
} from "@heroicons/react/24/outline";
import { HomeIcon, BellIcon, UserIcon } from "@heroicons/react/24/solid";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../redux/Hook/Hook";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useGetUserNotificationsQuery } from "../../redux/Feature/Admin/notification/notificationApi";
import { Badge } from "antd";

const BottomHeader = () => {
    const user = useAppSelector(useCurrentUser);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();
    const isAdminLogin = location.pathname === '/admin-login';
    
    const {
      data: notifications,
      refetch,
      isFetching,
    } = useGetUserNotificationsQuery(user?.id);
  
    useEffect(() => {
      if (notifications) {
        setUnreadCount(notifications?.data?.filter((n) => !n.isRead).length);
      }
    }, [notifications]);
  
  return (
    <div className={`lg:hidden fixed  bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 z-50 ${isAdminLogin ? "hidden" : ""}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `flex flex-col items-center px-4 py-2 ${isActive ? "text-[#2563EB]" : "text-gray-600"}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <HomeIcon className="w-6 h-6" />
                ) : (
                  <HomeIconOutline className="w-6 h-6" />
                )}
                <span className="text-xs mt-1">Home</span>
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/notification"
            className={({ isActive }) => 
              `flex flex-col items-center px-4 py-2 ${isActive ? "text-[#2563EB]" : "text-gray-600"}`
            }
          >
            {({ isActive }) => (
              <>
                <Badge count={unreadCount} overflowCount={9} className="cursor-pointer">
                  {isActive ? (
                    <BellIcon className="text-xl w-6 h-6 text-[#2563EB]" />
                  ) : (
                    <BellIconOutline className="text-xl w-6 h-6" />
                  )}
                </Badge>
                <span className="text-xs mt-1">Notifications</span>
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/user/user-profile"
            className={({ isActive }) => 
              `flex flex-col items-center px-4 py-2 ${isActive ? "text-[#2563EB]" : "text-gray-600"}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <UserIcon className="w-6 h-6" />
                ) : (
                  <UserIconOutline className="w-6 h-6" />
                )}
                <span className="text-xs mt-1">Profile</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default BottomHeader;