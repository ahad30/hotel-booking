import React  from "react";
import { Skeleton } from "antd";
import { toast } from "sonner";
import ChangePassword from "../../User/Password/ChangePassword";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../../../redux/Feature/Admin/usersmanagement/userApi";
import { useAppSelector } from "../../../../redux/Hook/Hook";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZEmail from "../../../../components/Form/ZEmail";
import ZPhone from "../../../../components/Form/ZPhone";


const EditAdminProfile = () => {
  const user = useAppSelector(useCurrentUser);

  const {
    data: userData,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetUserByIdQuery(user?.id);

  const [updateUser, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateUserMutation();

  const handleSubmit = async (data) => {
    const profileUpdateData = {
      ...data,
    };

    try {
      // Use unwrap() to handle the mutation result
      await updateUser({ id: user?.id, data: profileUpdateData }).unwrap();
      toast.success("Profile Updated Successfully");
    } catch (error) {
      // Handle error if the mutation fails
      toast.error("Failed to update profile. Please try again.");
      console.error("Update error:", error);
    }
  };

  if (profileLoading) {
    return <Skeleton />;
  }

  if (profileError) {
    return <div>Profile error occurred</div>;
  }

  return (
    <>
      <div className="bg-white p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10">
        <div className="flex flex-col justify-center items-center">
          <div className="relative w-56 h-[150px] left-5 lg:mt-[-70px]">
            <img
              className="h-[180px] w-[180px] rounded-full absolute object-cover"
              src={`https://ui-avatars.com/api/?name=${userData?.data?.name?.charAt(0) || "A"}`}
              alt={"admin_avatar"}
            />
          </div>

          <div className="flex flex-col justify-center items-center bg-[#bdcef4] px-6 rounded-t-[30px] w-[300px] h-[190px] gap-y-2">
            <h1 className="text-[#042656] mt-3 text-[16px] font-sans font-semibold">
              {userData?.data?.name || "Admin"}
            </h1>
            <span className="text-[#555555] mt-1 text-[13px] font-normal font-mono">
              {userData?.data?.email || "superadmin@gmail.com"}
            </span>
          </div>
        </div>

        <div>
          <ZFormTwo
            isLoading={updateLoading}
            isSuccess={updateSuccess}
            submit={handleSubmit}
            buttonName={"Save Changes"}
            formType={"edit"}
            data={userData?.data} // Pass the user data here
          >
            <div>
              <h1 className="text-2xl mt-2 text-center">Profile Information</h1>
            </div>

            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <div className="relative">
                <ZInputTwo
                  required={1}
                  name="name"
                  type="text"
                  label={"Name"}
                  placeholder={"Enter your name"}
                  value={userData?.data?.name}
                />
              </div>
              <div className="relative">
                <ZEmail  label={"Email"} name={"email"} value={userData?.data?.email} />
              </div>
              <div className="relative">
                <ZPhone label={"Phone"} name={"phone"} value={userData?.data?.phone} />
              </div>
            </div>
          </ZFormTwo>

        </div>
      </div>
          <div className="lg:flex justify-end mb-10 -mt-10 bg-white py-5">
           <div className="lg:w-[68%] px-4">
           <ChangePassword/>
           </div>
          </div>
    </>
  );
};

export default EditAdminProfile;