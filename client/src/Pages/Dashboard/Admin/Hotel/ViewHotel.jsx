import React from "react";
import { Alert, Table, Tag, Image } from "antd";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useGetHotelByIdQuery } from "../../../../redux/Feature/Admin/hotel/hotelApi";
import Skeleton from "../../../../components/Skeleton/Skeleton";
import Room from "../Room/Room";


const ViewHotel = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetHotelByIdQuery(id);
  
  if (isLoading ) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div>Error loading hotel details.</div>;
  }

  const hotel = data?.data;


  return (
    <section className="">
      <Link to={`/admin/hotels`}>
        <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-end my-5">
          <button className="bg-primary font-Poppins font-medium py-2 px-5 rounded-lg text-white">
            Back to Hotels
          </button>
        </div>
      </Link>

      <div className="mt-7 mb-4 space-y-5">
        <h2 className="text-xl lg:text-3xl text-center font-semibold mb-4 underline">
          Hotel Information
        </h2>
        <h1 className="text-lg lg:text-4xl font-semibold">{hotel?.name}</h1>
        <p className="text-xl text-gray-500">
          <span className="font-bold">Description:</span> {hotel?.description}
        </p>

        <div className="flex flex-col gap-10">
          {/* Hotel Image Section */}
          <div>
            <h2 className="text-xl font-semibold mb-5 underline">Hotel Image</h2>
            <div className="w-full lg:w-1/2 mx-auto">
              <Image
                src={hotel?.image}
                alt={hotel?.name}
                className="rounded-lg"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Hotel Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <p className="font-medium">
              <span className="font-bold me-2">Location:</span> {hotel?.location}
            </p>
            
            <p className="font-medium">
              <span className="font-bold me-2">Coordinates:</span> 
              {hotel?.latitude && hotel?.longitude ? (
                `${hotel.latitude}, ${hotel.longitude}`
              ) : (
                "N/A"
              )}
            </p>

            <p className="font-medium">
              <span className="font-bold me-2">Status:</span>
              <Tag color={hotel?.isActive ? "green" : "red"}>
                {hotel?.isActive ? "Active" : "Inactive"}
              </Tag>
            </p>

            <p className="font-medium">
              <span className="font-bold me-2">Created At:</span>
              {moment(hotel?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </p>

            <div className="font-medium">
              <span className="font-bold me-2">Amenities:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {hotel?.amenities?.map((amenity, index) => (
                  <Tag key={index} color="blue">
                    {amenity}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 underline">Rooms</h2>

                <Room hotelId={id}/>
       
      </div>
    </section>
  );
};

export default ViewHotel;