import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../../../redux/Modal/ModalSlice";
import axios from "axios";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import { useCreateRoomMutation } from "../../../../redux/Feature/Admin/room/roomApi";
import ZMultipleImage from "../../../../components/Form/ZMultipleImage";

const AddRoom = ({ hotelId }) => {
  const dispatch = useAppDispatch();
  const [createRoom, { isLoading, isError, error, isSuccess, data }] = useCreateRoomMutation();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setUploading(true);
      let imageUrls = [];

      // Handle multiple image uploads if provided
      if (formData?.images && formData.images.length > 0) {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

        // Upload all images in parallel
        const uploadPromises = formData.images.map(async (image) => {
          const imageFile = new FormData();
          imageFile.append('image', image);

          const res = await axios.post(image_hosting_api, imageFile, {
            headers: {
              'content-type': 'multipart/form-data'
            }
          });

          if (res?.data?.success) {
            return res.data.data.display_url;
          }
          throw new Error('Image upload failed');
        });

        // Wait for all uploads to complete
        imageUrls = await Promise.all(uploadPromises);
      }

      const roomData = {
        hotelId: hotelId,
        roomNumber: formData?.roomNumber,
        type: formData?.type,
        price: parseFloat(formData?.price),
        capacity: parseInt(formData?.capacity),
        child: parseInt(formData?.child),
        roomQty: parseInt(formData?.roomQty),
        images: imageUrls || [],
        amenities: formData?.amenities || [],
        isAvailable: formData?.isAvailable || true
      };

      await createRoom(roomData).unwrap();

    } catch (error) {
      console.error('Error handling form submission:', error);
      message.error(error.message || 'Error creating room. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen());
  };

  const roomTypeOptions = [
    { label: "Single", value: "Single" },
    { label: "Double", value: "Double" },
    { label: "Suite", value: "Suite" },
    { label: "Deluxe", value: "Deluxe" },
    { label: "Family", value: "Family" },
  ];

  const amenitiesOptions = [
    { label: "Free WiFi", value: "Free WiFi" },
    { label: "TV", value: "TV" },
    { label: "Air Conditioning", value: "Air Conditioning" },
    { label: "Mini Bar", value: "Mini Bar" },
    { label: "Safe", value: "Safe" },
    { label: "Balcony", value: "Balcony" },
  ];

  return (
    <div className="">
      <ZFormTwo
        isLoading={isLoading || uploading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}
        formType="create"
        data={data}
        buttonName="Create Room"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-10">
          <ZInputTwo
            name="roomNumber"
            type="text"
            label="Room Number"
            placeholder="Enter room number"
            required={1}
            reset
          />

          <ZSelect
            name="type"
            label="Room Type"
            options={roomTypeOptions}
            placeholder="Select room type"
            required={1}
          />

          <ZInputTwo
            name="price"
            type="number"
            label="Price (per night)"
            placeholder="Enter room price"
            required={1}
            reset
          />

          <ZInputTwo
            name="capacity"
            type="number"
            label="Capacity(Adult)"
            placeholder="Enter adult capacity"
            required={1}
            reset
          />

          <ZInputTwo
            name="child"
            type="number"
            label="Capacity(Child)"
            placeholder="Enter child  capacity"
            required={1}
            reset
          />
          <ZInputTwo
            name="roomQty"
            type="number"
            label="Room Quantity"
            placeholder="Enter room quantity"
            required={1}
            reset
          />

          <div className="lg:col-span-2">
            <ZMultipleImage 
              name="images" 
              label="Room Images" 
              maxCount={5}
              required={1}
            />
          </div>

          <div className="lg:col-span-2">
            <ZSelect
              name="amenities"
              label="Amenities"
              options={amenitiesOptions}
              placeholder="Select amenities"
              mode="multiple"
              required={1}
            />
          </div>

          <ZSelect
            name="isAvailable"
            label="Availability"
            options={[
              { label: "Available", value: true },
              { label: "Booked", value: false },
            ]}
            placeholder="Select availability status"
            required={1}
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default AddRoom;