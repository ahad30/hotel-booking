import { Link } from 'react-router-dom';
import Image1 from '../../../public/illustration.svg';

const PaymentError = () => {
  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="container px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
        {/* Left Section: Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">
            Payment Failed
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Oops! It looks like your payment couldn't be processed. Please check your payment details and try again.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            If the issue persists, feel free to contact our support team.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-8">
            <Link
              to="/checkout" // Replace with your checkout page route
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Retry Payment
            </Link>
            <Link
              to="/contact" // Replace with your support page route
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Contact Support
            </Link>
          </div>

          {/* Back to Shop Link */}
          <div className="mt-6 text-center lg:text-left">
            <Link
              to="/" // Replace with your shop page route
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>

        {/* Right Section: Illustration */}
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
          <img
            className="w-full max-w-lg mx-auto lg:mx-0"
            src={Image1}
            alt="Payment Failed Illustration"
          />
        </div>
      </div>
    </section>
  );
};

export default PaymentError;