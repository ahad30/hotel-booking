import React, { useState, useEffect } from "react";
import { LeftCircleFilled } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useGetDistrictsByDivisionQuery } from "../../redux/Feature/User/place/placeApi";

const District = () => {
  const { divisionId } = useParams();
  const [districts, setDistricts] = useState([]);
  const { data: districtsData, isLoading, isError } = useGetDistrictsByDivisionQuery(divisionId);

  useEffect(() => {
    if (districtsData) {
      setDistricts(districtsData.data);
    }
  }, [districtsData]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div>Loading districts...</div>
    </div>
  );

  if (isError) return (
    <div className="flex justify-center items-center min-h-screen">
      <div>Error loading districts</div>
    </div>
  );

  return (
    <>
      <Link to="/division"> {/* Update this to your actual route */}
        <LeftCircleFilled className="ms-2 mt-2 text-2xl" />
      </Link>
      <div className="w-full max-w-md mx-auto bg-white min-h-screen p-4 space-y-6 mb-16">
       
      <div className="flex items-center justify-between border-b pb-2">
        <button
          // onClick={goPrevious}
          className="text-sm px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <h2 className="text-lg font-semibold"></h2>
        <button
          // onClick={goNext}
          className="text-sm px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
       
        <div className="space-y-2">
          <h3 className="text-md font-medium">Select District</h3>
          <ul className="space-y-2">
            {districts.map((district, idx) => (
             <Link to={`/area/${district.id}`} key={idx}>
                <li
                  className="bg-blue-100 px-4 py-3 rounded shadow text-center cursor-pointer hover:bg-blue-200 mb-4"
                >
                  {district.name} 
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default District;