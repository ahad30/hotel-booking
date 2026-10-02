
import React from "react";
import ZFormTwo from "@/components/Form/ZFormTwo";
import ZInputTwo from "@/components/Form/ZInputTwo";
import { useAppDispatch } from "@/redux/Hook/Hook";
import { setIsEditModalOpen } from "@/redux/Modal/ModalSlice";
import { useUpdateUserMutation } from "@/redux/Feature/Admin/usersmanagement/userApi";


const EditUser = ({ selectedUser }) => {
  // console.log(selectedUser);
  const dispatch = useAppDispatch();
  const [editUser, { isLoading: CIsloading, isError: CIsError, error: CError, isSuccess: CIsSuccess, data }] = useUpdateUserMutation();

  const handleSubmit = (data) => {
    const updatedData = {
      id: selectedUser.id,
      data,
    };
    editUser(updatedData);
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsEditModalOpen());
  };

  return (
    <div className="">
      <ZFormTwo
        isLoading={CIsloading}
        isSuccess={CIsSuccess}
        isError={CIsError}
        error={CError}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}  
        formType="edit"  
        data={data}
        buttonName="Update"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          <ZInputTwo
            value={selectedUser?.username}
            name="erpUsername"
            type="text"
            label="Username"
            defaultKey={""}
            placeholder={"Enter the username"}
            required
          />
          <ZInputTwo
            value={selectedUser?.role}
            name="erpUserRole"
            type="text"
            label="User Role"
            defaultKey={""}
            placeholder={"Enter the user role"}
            required
          />
          <ZInputTwo
            value={selectedUser?.email}
            name="erpUserEmail"
            type="email"
            label="Email"
            defaultKey={""}
            placeholder={"Enter the email"}
            required
          />
          <ZInputTwo
            value={selectedUser?.phone}
            name="erpUserPhone"
            type="text"
            label="Phone"
            defaultKey={""}
            placeholder={"Enter the phone number"}
            required
          />
          <ZInputTwo
            value={selectedUser?.fullName}
            name="erpUserFullName"
            type="text"
            label="Full Name"
            defaultKey={""}
            placeholder={"Enter the full name"}
            required
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default EditUser;
