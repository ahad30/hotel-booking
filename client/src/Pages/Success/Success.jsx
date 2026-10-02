
import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Success = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const queryParams = new URLSearchParams(location.search);
  // const sessionId = queryParams.get("sessionId");
  // const transactionId = queryParams.get("transactionId");
  // console.log(sessionId)
  // useEffect(() => {
  //   const verifyPayment = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/api/v1/success?sessionId=${sessionId}&transactionId=${transactionId}`
  //       );
  //       if (response.data.success) {
  //         // Payment verified, show success message
  //         console.log("Payment successful!");
  //       } else {
  //         // Payment failed, redirect to cancel page
  //         navigate("/cancel");
  //       }
  //     } catch (error) {
  //       console.error("Error verifying payment:", error);
  //       navigate("/cancel");
  //     }
  //   };

  //   if (sessionId && transactionId) {
  //     verifyPayment();
  //   } else {
  //     navigate("/cancel");
  //   }
  // }, [sessionId, transactionId, navigate]);


  return (
    <div>
      <section className="bg-gray-900 text-white -mb-8">
  <div className=" px-4 py-32 lg:flex lg:h-[100vh] lg:items-center">
    <div className="mx-auto max-w-5xl text-center">
      <h1
        className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
      >
       Thank you for your boooking! Your booking is being processed and will be assessed within 1-2 hours.


      </h1>

      <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
        Please check your booking confirmation in your given email.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to={`/`}
          className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
         
        >
         Continue Booking more..
        </Link>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Success;
