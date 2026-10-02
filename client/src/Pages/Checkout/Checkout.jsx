"use client";
import React, { useEffect } from "react";
import ZFormTwo from "../../components/Form/ZFormTwo";
import ZInputTwo from "../../components/Form/ZInputTwo";
import ZEmail from "../../components/Form/ZEmail";
import ZPhone from "../../components/Form/ZPhone";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { toast } from "sonner";
import { useCreateBookingMutation } from "../../redux/Feature/Admin/booking/bookingApi";
import { clearBooking } from "../../redux/Booking/bookingSlice";
import { Image } from "antd";
import moment from "moment";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);

  const {
    selectedRooms,
    checkInDate,
    checkOutDate,
    totalPrice,
    nights
  } = useAppSelector((state) => state.booking);
  console.log(nights)

  const [createBooking, { isLoading, isSuccess, isError, error, data }] =
    useCreateBookingMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (formData) => {
    if (!selectedRooms?.length) {
      toast.error("Please select rooms before checking out.");
      return;
    }

    // Create booking items array with room details
    const bookingItems = selectedRooms.map((room) => ({
      roomNumber:room?.roomNumber,
      roomId: room.id,
      roomType: room.type,
      quantity: room?.quantity,
      adults: room.adults,
      children: room.children,
      price: room.price,
      amenities: room.amenities || []
    }));

    const bookingPayload = {
      roomIds: selectedRooms.map((room) => room.id),
      userId: user?.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      email: formData?.email || "",
      phone: formData?.phone,
      name: formData?.name,
      status: "pending",
      bookingItem: bookingItems,
    };

    console.log(bookingPayload)

    try {
      const res = await createBooking(bookingPayload).unwrap();
      if (res?.data?.payment_url) {
        toast.success("Booking successful!");
        dispatch(clearBooking());
        window.location.href = res.data.payment_url;
      } else {
        toast.error("Booking created, but payment URL not received!");
      }
    } catch (err) {
      toast.error("Failed to book, please try again.");
      console.error(err);
    }
  };        

  return (
    <>
      <div className="bg-gray-900 text-white py-16">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            You've made
            <span className="sm:block"> an excellent choice </span>
          </h1>
          <h1 className="text-white text-3xl font-extrabold sm:text-3xl mt-5 animate-bounce">
            Checkout here!
          </h1>
        </div>
      </div>

      <ZFormTwo
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        formType="create"
        data={data}
      >
        <div className="bg-gray-100 py-10">
          <div className="flex flex-col lg:flex-row max-w-6xl mx-auto mb-10 gap-5">
            {/* Guest Info Form */}
            <div className="bg-white p-6 shadow-md rounded-lg w-[90%] mx-auto lg:w-[60%] space-y-4">
              <p className="text-sm lg:text-xl font-semibold">Our Default Payment Method</p>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="sslcommerz"
                  name="paymentMethod"
                  value="sslcommerz"
                  defaultChecked
                  className="accent-primary w-4 h-4"
                />
                <label htmlFor="sslcommerz" className="text-sm font-medium">
                  SSL Commerz
                </label>
              </div>

              <hr className="my-4" />

              <p className="text-xl font-semibold">Guest Information</p>
              <ZInputTwo
                name="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                required
              />
              <ZEmail name="email" label="Email Address(Optional)" />
              <ZPhone name="phone" label="Phone Number" type="text" required />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-sm  bg-primary text-white py-2 rounded-md lg:text-lg hover:bg-primary/90"
              >
                {isLoading ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>

            {/* Summary Card */}
            {selectedRooms.length > 0 ? (
              <div className="bg-white p-6 shadow-md rounded-lg w-[90%] mx-auto lg:w-[40%] space-y-4">
                <Image
                  src={selectedRooms[0]?.images[0]}
                  alt="Selected Room"
                  className="rounded-lg"
                  style={{ width: '500px', height: '200px', objectFit: 'cover' }}
                />
                <h2 className="text-lg font-semibold">Your Trip Summary</h2>
                <div className="text-sm">
                  <p><span className="font-bold">Check-in :</span> {moment(checkInDate).format("Do MMM YYYY ,  h:mm a")}</p>
                  <p><span className="font-bold">Check-out :</span> {moment(checkOutDate).format("Do MMM YYYY ,  h:mm a")}</p>
                  <p><span className="font-bold">Nights :</span> {nights} </p>
                 
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                    <p className="font-bold text-base">Rooms:</p>
                  <div className="flex justify-center  text-base">
                    <span>{selectedRooms.map((room, index) => {
                      return <div key={index}>
                        <p>{room.type} - {room.price} Tk (x {room.quantity}) : {room.price * room.quantity} Tk</p>
                        <p></p>
                      </div>
                    })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base">
                    <span>Total Price:</span>
                    <span>{totalPrice?.toFixed(2)} tk/-</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg w-[90%] mx-auto lg:w-[40%]  flex flex-col justify-center items-center text-center p-6">
                <h2 className="text-xl font-semibold text-red-500">No Rooms Selected</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Please go back and select at least one room to proceed with your booking.
                </p>
              </div>
            )}
          </div>
        </div>
      </ZFormTwo>
    </>
  );
};

export default Checkout;