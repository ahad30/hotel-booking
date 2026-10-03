import { useParams } from "react-router-dom";
import { useGetHotelByAreaQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";
import HotelCard, { HotelCardSkeleton } from "../../../components/ui/HotelCard";
import { PlaceHeader, PlaceState } from "../../../components/ui/PlaceList";
import { pluralize } from "../../../utils/format";

const AreaByHotel = () => {
  const { areaId } = useParams();
  const { data, isFetching, isError, refetch } = useGetHotelByAreaQuery(areaId);
  const hotels = data?.data || [];

  return (
    <>
      <PlaceHeader
        step={3}
        back={{ to: "/division", label: "Change location" }}
        title="Hotels in this area"
        subtitle={isFetching ? "Finding hotels…" : `${pluralize(hotels.length, "hotel")} found`}
      />
      <div className="container-x py-10 pb-28 lg:pb-16">
        {isError ? (
          <PlaceState type="error" onRetry={refetch}>
            We couldn&apos;t load hotels for this area.
          </PlaceState>
        ) : !isFetching && hotels.length === 0 ? (
          <PlaceState>No hotels are listed in this area yet. Try a nearby area.</PlaceState>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {isFetching
              ? Array.from({ length: 3 }).map((_, i) => <HotelCardSkeleton key={i} />)
              : hotels.map((hotel, i) => <HotelCard key={hotel.id} hotel={hotel} index={i} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default AreaByHotel;
