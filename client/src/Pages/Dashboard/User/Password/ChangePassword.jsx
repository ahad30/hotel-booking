import React from "react";
import { useGetUserByIdQuery, useUpdatePasswordMutation } from "../../../../redux/Feature/Admin/usersmanagement/userApi";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import { useAppSelector } from "../../../../redux/Hook/Hook";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import { Skeleton } from "antd";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import { toast } from "sonner";

const ChangePassword = () => {
  const user = useAppSelector(useCurrentUser);

  const {
    data: userData,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetUserByIdQuery(user?.id);

  const [updatePassword, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdatePasswordMutation();

  const handleSubmit = async (data) => {
    const { newPassword, confirmPassword } = data;

    // Validate that newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      await updatePassword({ id: user?.id, newPassword, confirmPassword }).unwrap();
      toast.success("Password Updated Successfully");
    } catch (error) {
      // Handle error if the mutation fails
      toast.error(error?.data?.message || "Failed to update password. Please try again.");
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
      <div className="py-10">
        <ZFormTwo
          isLoading={updateLoading}
          isSuccess={updateSuccess}
          submit={handleSubmit}
          buttonName={"Update Password"}
          formType={"edit"}
          data={userData?.data}
        >
          <div>
            <h1 className="text-2xl mt-2 text-center">Change Password</h1>
          </div>

          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <div className="relative">
              <ZInputTwo
                required={1}
                name="newPassword"
                type="password" // Use type="password" for security
                label={"New Password"}
                placeholder={"Enter your new password"}
              />
            </div>
            <div className="relative">
              <ZInputTwo
                required={1}
                name="confirmPassword"
                type="password" // Use type="password" for security
                label={"Confirm Password"}
                placeholder={"Confirm your new password"}
              />
            </div>
          </div>
        </ZFormTwo>
      </div>
    </>
  );
};

export default ChangePassword;