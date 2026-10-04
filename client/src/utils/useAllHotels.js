import { useMemo } from "react";
import { useGetHotelsBySearchQuery } from "../redux/Feature/Admin/hotel/hotelApi";
import { lowestRoomPrice } from "./format";

// Every hotel with its rooms. Uses the same arguments as the unfiltered home
// list, so all pages share one cached request.
export const ALL_HOTELS_ARGS = { name: "", divisionId: "", cityId: "" };

export const useAllHotels = () => {
  const query = useGetHotelsBySearchQuery(ALL_HOTELS_ARGS);
  const hotels = useMemo(
    () => (query.data?.data || []).map((h) => ({ ...h, fromPrice: lowestRoomPrice(h.rooms) })),
    [query.data]
  );
  const byId = useMemo(() => new Map(hotels.map((h) => [h.id, h])), [hotels]);
  return { ...query, hotels, byId };
};
