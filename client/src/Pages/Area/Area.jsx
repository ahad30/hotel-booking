import React, { useState, useEffect } from "react";
import { LeftCircleFilled } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useGetAreasByDistrictQuery } from "../../redux/Feature/User/place/placeApi";

const Area = () => {
  const { districtId } = useParams();
  // console.log(districtId)
  const [areas, setAreas] = useState([]);
  const { data: areasData, isLoading, isError } = useGetAreasByDistrictQuery(districtId);

  useEffect(() => {
    if (areasData) {
      setAreas(areasData.data);
    }
  }, [areasData]);

  if (areasData?.data?.length === 0) return (
    <div className="flex justify-center items-center min-h-screen">
      <div>No areas found</div>
    </div>
  );


  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div>Loading areas...</div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen">
      <div>Error loading areas</div>
    </div>
  );

  return (
    <>
      {/* <Link to={`/districts/${districtId}`}> 
        <LeftCircleFilled className="ms-2 mt-2 text-2xl" />
      </Link> */}
      <div className="w-full max-w-md mx-auto bg-white min-h-screen p-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-md font-medium">Select Area</h3>
          <ul className="space-y-2">
            {areas.map((area, idx) => (
             <Link to={`/hotel/${area.id}`} key={idx}>
              <li
                key={idx}
                className="bg-blue-100 px-4 py-3 rounded shadow text-center cursor-pointer hover:bg-blue-200 mb-4"
              >
                {area.name}
              </li>
            </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Area;