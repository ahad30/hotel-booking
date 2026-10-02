import React from "react";
import { toast } from "sonner";
import { useAppDispatch } from "../../../../redux/Hook/Hook";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import { setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";
import { useUpdateBookingMutation } from "../../../../redux/Feature/Admin/booking/bookingApi";



const EditBooking = ({ selectedBooking }) => {
  const dispatch = useAppDispatch();
  const [updateBooking, { isLoading, isError, error, isSuccess, data }] = useUpdateBookingMutation();

  const handleSubmit = async (formData) => {
    try {
      const bookingData = {
        status: formData?.status,
      };
      
      await updateBooking({ id: selectedBooking.id, data: bookingData });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Error updating booking. Please try again.');
    }
  };

  const handleCloseModal = () => {
    dispatch(setIsEditModalOpen());
  };

  return (
    <div className="">
      <ZFormTwo
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        closeModal={handleCloseModal}  
        formType="edit"  
        data={data}
        buttonName="Update Booking"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          <ZSelect
            name="status"
            label="Booking Status"
            options={[
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            placeholder="Select booking status"
            value={selectedBooking?.status}
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default EditBooking;