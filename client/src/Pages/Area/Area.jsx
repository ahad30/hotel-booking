import { useParams } from "react-router-dom";
import { useGetAreasByDistrictQuery, useGetDistrictsQuery } from "../../redux/Feature/User/place/placeApi";
import PlaceList, { PlaceHeader } from "../../components/ui/PlaceList";

const Area = () => {
  const { districtId } = useParams();
  const { data, isLoading, isError, refetch } = useGetAreasByDistrictQuery(districtId);
  const { data: districts } = useGetDistrictsQuery();
  const district = districts?.data?.find((d) => d.id === districtId);

  return (
    <>
      <PlaceHeader
        step={2}
        back={district ? { to: `/district/${district.division_id}`, label: "Back to districts" } : { to: "/division", label: "All divisions" }}
        title={district ? `Areas in ${district.name}` : "Choose an area"}
        subtitle="Pick an area to see every hotel there."
      />
      <div className="container-x py-10 pb-28 lg:pb-16">
        <PlaceList
          items={data?.data}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          noun="area"
          linkFor={(a) => `/hotel/${a.id}`}
        />
      </div>
    </>
  );
};

export default Area;
