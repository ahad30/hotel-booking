import React from 'react'
import { IoIosArrowDroprightCircle } from 'react-icons/io'

const UserNavbar = ({isSidebarOpen, toggleSidebar , setIsSidebarOpen}) => {
  return (
          <div className="lg:px-6">
            <div className="flex justify-between items-center fixed z-40 top-0">
              <div>
                {isSidebarOpen === false && (
                  <button
                    className="lg:hidden"
                    onClick={() => setIsSidebarOpen((prev) => !prev)}
                  >
                    <IoIosArrowDroprightCircle size={25} className="text-blue-500" />
                  </button>
                )}
    
                {/* <p className="text-[#E0E0E0] hidden lg:block">Hotel Universe</p> */}
              </div>
              {/* profile */}
              <div>
                {/* <Dropdown></Dropdown> */}
              </div>
            </div>
          </div>
  )
}

export default UserNavbar