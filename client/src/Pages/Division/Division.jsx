import { useGetDivisionsQuery } from "../../redux/Feature/User/place/placeApi";
import { PlaceHeader, PlaceState } from "../../components/ui/PlaceList";
import { DivisionTile } from "../Home/Destinations/Destinations";

const Division = () => {
  const { data, isLoading, isError, refetch } = useGetDivisionsQuery();
  const divisions = data?.data || [];

  return (
    <>
      <PlaceHeader
        step={0}
        title="Where are you headed?"
        subtitle="Start with a division. We'll narrow it down to districts and areas next."
      />
      <div className="container-x py-10 pb-28 lg:pb-16">
        {isError ? (
          <PlaceState type="error" onRetry={refetch}>
            We couldn&apos;t load the divisions. Check your connection and try again.
          </PlaceState>
        ) : (
          <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton rounded-3xl" />)
              : divisions.map((d) => <DivisionTile key={d.id} division={d} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default Division;
