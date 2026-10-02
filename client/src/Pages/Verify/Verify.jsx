import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../../redux/Feature/auth/authApi";

const Verify = () => {
  // Extract the token from the URL
  const { token } = useParams();

  // Use the verifyEmail mutation
  const [verifyEmail, { isLoading, isError, isSuccess, data, error }] = useVerifyEmailMutation();

  // Call the API when the component mounts
  useEffect(() => {
    if (token) {
      verifyEmail(token); // Pass the token to the mutation
    }
  }, [token, verifyEmail]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Verifying your email... Please wait.</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Email Verification Failed</h2>
          <p className="text-gray-700">
            {error?.data?.message || "There was an issue verifying your email. Please try again or contact support."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Display success state
  if (isSuccess && data?.success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-7">Email Verified Successfully!</h2>
          {/* <p className="text-gray-700 mb-5">{data.message}</p> */}
          <a
            href="/login"
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Default state (if no token is found or verification fails)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4">Invalid Verification Link</h2>
        <p className="text-gray-700">
          No verification token found. Please check your email for the correct link.
        </p>
        <a
          href="/"
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Verify;