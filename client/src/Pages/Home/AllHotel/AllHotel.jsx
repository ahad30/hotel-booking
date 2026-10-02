import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductsSkeleton from "../../../components/Skeleton/ProductsSkeleton";
import { IoLocationOutline } from "react-icons/io5";
import { FaList, FaTh } from "react-icons/fa";
import Image1 from "../../../../public/image.png";
import { useGetHotelsBySearchQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";

const AllHotel = () => {
  const { searchQuery, divisionId, cityId } = useOutletContext();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); 
  const { data, error, isLoading, isFetching } = useGetHotelsBySearchQuery({
    name: searchQuery,
    divisionId,
    cityId
  });

  useEffect(() => {
    if (isFetching || isLoading) {
      setShowSkeleton(true);
    } else {
      setShowSkeleton(false);
    }
  }, [isFetching, isLoading]);

  const noHotelsFound = !isLoading && !showSkeleton && data?.data?.length === 0 &&
    (searchQuery.trim() !== "" || cityId || divisionId);

  return (
    <div className="pb-[80px]">
      <SectionTitle title="Check our all hotels" />
      
      {/* View Mode Toggle */}
      <div className="hidden md:flex justify-end mb-4 mr-4">
        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaTh className="text-sm" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaList className="text-sm" />
          </button>
        </div>
      </div>

      {/* Show Skeleton While Loading */}
      {(isLoading || showSkeleton) && <ProductsSkeleton hotelData={data?.data} viewMode={viewMode} />}

      {/* Show "No hotels found" message */}
      {noHotelsFound && (
        <div className="text-center text-[13px] md:text-xl font-bold text-red-500">
          No hotel found for the given criteria.
        </div>
      )}
      
      {/* Hotels Container */}
      <div className={`${
        viewMode === 'grid' 
          ? 'lg:max-w-[98%] grid grid-cols-2 lg:grid-cols-3 gap-4 mx-auto' 
          : ' mx-auto space-y-4'
      }`}>
        {!isLoading && !showSkeleton && data?.data?.map((hotel, index) => (
          <Link 
            to={`/hotel-details/${hotel?.id}`} 
            key={index}
            className={`block ${
              viewMode === 'list' 
                ? 'flex flex-row h-48' 
                : 'flex flex-col'
            } rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow`}
          >
            {/* Image */}
            <div className={`${
              viewMode === 'list' 
                ? 'w-1/3 h-full' 
                : 'h-[110px] md:h-[300px]'
            } relative`}>
              <img
                src={hotel?.image || Image1}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className={`${
              viewMode === 'list' 
                ? 'w-2/3 p-4 flex flex-col justify-between' 
                : 'flex-1 px-2 py-1 md:px-4 md:py-4'
            }`}>
              <div className={`${
                viewMode === 'list' 
                  ? 'flex flex-col h-full justify-between' 
                  : 'flex flex-col lg:gap-8'
              }`}>
                {/* Hotel Info */}
                <div className={`${
                  viewMode === 'list' 
                    ? 'space-y-2' 
                    : 'md:space-y-4 lg:px-3 py-2 md:py-5 lg:py-0'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
                    <h2 className={`font-semibold text-[#1A1A1A] ${
                      viewMode === 'list' 
                        ? 'text-lg md:text-xl' 
                        : 'text-[10px] md:text-2xl'
                    }`}>
                      {hotel.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1 text-[#666666] md:mb-4">
                    <IoLocationOutline className="text-lg text-blue-500" />
                    <span className={`${
                      viewMode === 'list' 
                        ? 'text-sm' 
                        : 'text-[8px] md:text-[14px]'
                    }`}>
                      {hotel.location}
                    </span>
                  </div>

                  {/* Amenities - Show more in list view */}
                  {viewMode === 'list' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hotel.amenities.slice(0, 4).map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                          +{hotel.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Section */}
                <div className={`${
                  viewMode === 'list' 
                    ? 'flex items-center justify-between mt-auto' 
                    : 'md:min-w-[300px] md:space-y-5'
                }`}>
                  {/* Amenities - Grid view only */}
                  {viewMode === 'grid' && (
                    <div className="md:flex hidden gap-2">
                      {hotel.amenities.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-sm hidden lg:block ${
                            tag === "Best"
                              ? "bg-[#B8BBFF40] text-[#5054D9]"
                              : "bg-[#FFD18140] text-[#F99F1D]"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="px-3 py-1 rounded-full text-sm hidden lg:block bg-[#FFD18140] text-[#F99F1D]">
                        + more..
                      </span>
                    </div>
                  )}

                  {/* Price and Button */}
                  {viewMode === 'list' && hotel.rooms && hotel.rooms.length > 0 && (
                    <div className="text-lg font-bold text-blue-600">
                      {hotel.rooms[0]?.price} Tk/night
                    </div>
                  )}
                  
                  <div className={`${viewMode === 'list' ? 'w-auto' : 'w-full'}`}>
                    <button className={`text-[#5054D9] font-medium transition ${
                      viewMode === 'list' 
                        ? 'px-4 py-2 rounded-lg border border-[#5054D9] hover:bg-[#5054D9] hover:text-white' 
                        : 'text-xs lg:text-base py-1 lg:py-3 w-full rounded-lg border border-[#5054D9] px-1 mb-4'
                    }`}>
                      {viewMode === 'list' ? 'View Details' : 'Choose Room'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllHotel;