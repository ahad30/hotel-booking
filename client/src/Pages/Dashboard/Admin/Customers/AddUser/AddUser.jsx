import React, { useEffect } from "react";
import { useAddUserMutation } from "../../../../../redux/Feature/Admin/usersmanagement/userApi";
import { useAppDispatch } from "../../../../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../../../../redux/Modal/ModalSlice";
import ZFormTwo from "../../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../../components/Form/ZInputTwo";
import { useNavigate } from "react-router-dom"; // For React Router v6
import BreadCrumb from "../../../../../components/BreadCrumb/BreadCrumb";
import { toast } from "sonner";

const AddUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const [createUser, { isLoading: CIsloading, isError: CIsError, error: CError, isSuccess: CIsSuccess, data }] = useAddUserMutation();

  const handleSubmit = async (formData) => {
    const response = await createUser({ ...formData, role: "user" });

    if(response){
      toast.success("User created Successfully")
      navigate("/admin/users"); // 
    }
  };


  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen());
  };

  return (
    <div className="">
    <BreadCrumb/>
      <ZFormTwo
        // isLoading={CIsloading}
        isSuccess={CIsSuccess}
        isError={CIsError}
        error={CError}
        submit={handleSubmit}
        formType="create"
        data={data}
      >
        <div className="w-[50%] bg-white rounded-lg p-5 mx-auto grid grid-cols-1 gap-3 mt-10">
          <ZInputTwo
            name="name"
            type="text"
            label="User Name"
            defaultKey={""}
            placeholder={"Enter the username"}
            required={1}
          />
          <ZInputTwo
            name="email"
            type="email"
            label="Email"
            defaultKey={""}
            placeholder={"Enter the email"}
            required={1}

          />
          <ZInputTwo
            name="phone"
            type="text"
            label="Phone"
            defaultKey={""}
            placeholder={"Enter the phone number"}
            required={1}

          />
          <ZInputTwo
            name="password"
            type="password"
            label="Password"
            defaultKey={""}
            placeholder={"Enter the password"}
            required={1}

          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            disabled={CIsloading} // Disable button while loading
          >
            {CIsloading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </ZFormTwo>
    </div>
  );
};

export default AddUser;