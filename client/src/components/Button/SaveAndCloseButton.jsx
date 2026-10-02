import React, { useContext } from "react";


const SaveAndCloseButton = ({ title, isLoading, closeModal }) => {


  return (
    <div className="flex items-center gap-x-3 justify-end">
      {closeModal && (
        <button
          disabled={isLoading}
          onClick={() => closeModal()}
          type="button"
          className="bg-gray-200 disabled:cursor-not-allowed text-center text-gray-600 w-full lg:w-[200px] h-[45px] rounded-md"
        >
        Close
        </button>
      )}
      <button
        disabled={isLoading}
        type="submit"
        className={`${
          title === "Login"
            ? "lg:w-[88px] h-[35px]"
            : "w-full lg:w-[200px] h-[45px]"
        } bg-[#24354C] disabled:bg-[#4f5a67] disabled:cursor-not-allowed text-center text-white rounded-md`}
      >
        {isLoading
         ? "Processing..."
          : title}
      </button>
    </div>
  );
};

export default SaveAndCloseButton;
