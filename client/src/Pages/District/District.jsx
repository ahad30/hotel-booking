import { useParams } from "react-router-dom";
import { useGetDistrictsByDivisionQuery, useGetDivisionsQuery } from "../../redux/Feature/User/place/placeApi";
import PlaceList, { PlaceHeader } from "../../components/ui/PlaceList";

const District = () => {
  const { divisionId } = useParams();
  const { data, isLoading, isError, refetch } = useGetDistrictsByDivisionQuery(divisionId);
  const { data: divisions } = useGetDivisionsQuery();
  const division = divisions?.data?.find((d) => String(d.serialId) === String(divisionId));

  return (
    <>
      <PlaceHeader
        step={1}
        back={{ to: "/division", label: "All divisions" }}
        title={division ? `Districts in ${division.name}` : "Choose a district"}
        subtitle="Pick a district to see its areas."
      />
      <div className="container-x py-10 pb-28 lg:pb-16">
        <PlaceList
          items={data?.data}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          noun="district"
          linkFor={(d) => `/area/${d.id}`}
        />
      </div>
    </>
  );
};

export default District;
