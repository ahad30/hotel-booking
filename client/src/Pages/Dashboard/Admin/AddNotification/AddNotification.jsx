import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../../../redux/Modal/ModalSlice";
import { message } from "antd";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import ZInputTextArea from "../../../../components/Form/ZInputTextArea";
import { useCreateNotificationMutation } from "../../../../redux/Feature/Admin/notification/notificationApi";
import { useGetUsersQuery } from "../../../../redux/Feature/Admin/usersmanagement/userApi";


const AddNotification = () => {

  const [createNotification, { isLoading, isError, error, isSuccess, data }] = useCreateNotificationMutation();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery();
  const [users, setUsers] = useState([]);

  const notificationTypes = [
    { label: "Booking Confirmation", value: "BOOKING_CONFIRMATION" },
    { label: "Booking Cancellation", value: "BOOKING_CANCELLATION" },
    { label: "Promotion", value: "PROMOTION" },
    { label: "Review Reminder", value: "REVIEW_REMINDER" },
    { label: "General", value: "GENERAL" },
  ];

  useEffect(() => {
    if (usersData?.data) {
      const formattedUsers = usersData.data.map(user => ({
        label: user.name || user.email,
        value: user.id
      }));
      setUsers(formattedUsers);
    }
  }, [usersData]);

  const handleSubmit = async (formData) => {
    try {
      const notificationData = {
        userId: formData.userId,
        type: formData.type,
        title: formData.title,
        message: formData.message,
        link: formData.link || null,
        // bookingId: formData.type.includes('BOOKING') ? formData.bookingId : null,
        // data: formData.data ? JSON.parse(formData.data) : null,
        isRead: false
      };

      await createNotification(notificationData).unwrap();
      message.success("Notification created successfully!");
    } catch (error) {
      console.error('Error creating notification:', error);
      message.error(error.data?.message || 'Failed to create notification');
    }
  };

 

  return (
    <div className="">
      <ZFormTwo
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}

        formType="create"
        data={data}
        buttonName="Send Notification"
       
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-10">
          <ZSelect
            name="userId"
            label="Recipient"
            options={users}
            placeholder="Select user"
            loading={isUsersLoading}
            required={1}
           
          />

          <ZSelect
            name="type"
            label="Notification Type"
            options={notificationTypes}
            placeholder="Select notification type"
            required={1}
          />

          <ZInputTwo
            name="title"
            type="text"
            label="Title"
            placeholder="Enter notification title"
            required={1}
          />

        

          <ZInputTwo
            name="link"
            type="text"
            label="Link (Optional)"
            placeholder="Enter URL to open on click"
          />

  <div className="col-span-1 lg:col-span-2">
  <ZInputTextArea
            name="message"
            label="Message"
            placeholder="Enter notification message"
            required={1}
            rows={4}
          />
  </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <ZInputTwo
              name="bookingId"
              type="text"
              label="Booking ID (Optional)"
              placeholder="Enter booking ID"
             
            />


          </div> */}

          {/* <ZInputTextArea
            name="data"
            label="Additional Data (JSON)"
            placeholder='Enter JSON data (e.g., {"key":"value"})'
            rows={3}
          /> */}
        </div>
      </ZFormTwo>
    </div>
  );
};

export default AddNotification;