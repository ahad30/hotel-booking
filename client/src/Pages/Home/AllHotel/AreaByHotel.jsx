import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductsSkeleton from "../../../components/Skeleton/ProductsSkeleton";
import { IoLocationOutline } from "react-icons/io5";
import Image1 from "../../../../public/image.png";
import { useGetHotelByAreaQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";

const AreaByHotel = () => {
const {areaId} = useParams()
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { data, error, isLoading, isFetching } = useGetHotelByAreaQuery(areaId);

  useEffect(() => {
    if (isFetching || isLoading) {
      setShowSkeleton(true);
    } else {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFetching , isLoading]);



  const noHotelsFound = !isLoading && !showSkeleton && data?.data?.length === 0

  return (
    <div className="pb-[80px]">
      <SectionTitle title="Check all hotel under the area" />

      {/* Show Skeleton While Loading */}
      {(isLoading || showSkeleton) && <ProductsSkeleton hotelData={data?.data}/>}

      {/* Show "No hotels found" message */}
      {noHotelsFound && (
        <div className="text-center text-[13px] md:text-xl font-bold text-red-500 mt-10">
          No hotel found for the given criteria.
        </div>
      )}
      
      <div className="lg:max-w-[98%] grid grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
        {!isLoading && !showSkeleton && data?.data?.map((hotel, index) => (
          <Link to={`/hotel-details/${hotel?.id}`} key={index}>
          <div key={index} className="flex flex-col rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
            <div className="relative h-[110px] object-cover md:h-[300px]">
              <img
                src={hotel?.image || Image1}
                alt={"Hotel Image"}
                className="w-full h-full object-cover text-[10px]"
              />
            </div>

            <div className="flex-1 px-2 py-1 md:px-4 md:py-4">
              <div className="flex flex-col lg:gap-8">
                <div className="flex-1 md:space-y-4 lg:px-3 py-2 md:py-5 lg:py-0">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
                    <h2 className="text-[10px] md:text-2xl font-semibold text-[#1A1A1A]">
                      {hotel.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1 text-[#666666] md:mb-4">
                    <IoLocationOutline className="text-lg text-blue-500 block" />
                    <span className="text-[8px] md:text-[14px]">
                      {hotel.location}
                    </span>
                  </div>
                </div>

                <div className="md:min-w-[300px] md:space-y-5">
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
                  <div>
                    <Link to={`/hotel-details/${hotel?.id}`}>
                      <button className="text-[#5054D9] text-xs lg:text-base py-1 lg:py-3 w-full rounded-lg border border-[#5054D9] transition font-medium px-1 mb-4">
                        Choose Room
                      </button>
                    </Link>
                  </div>
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

export default AreaByHotel;