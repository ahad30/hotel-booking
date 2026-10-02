import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import ZMultipleImage from "../../../../components/Form/ZMultipleImage";
import { Link, useParams } from "react-router-dom";
import { useGetRoomByIdQuery, useUpdateRoomMutation } from "../../../../redux/Feature/Admin/room/roomApi";

const EditRoom = () => {
  const { id } = useParams();
  const [updateRoom, { isLoading, isError, error, isSuccess, data }] = useUpdateRoomMutation();
  const { data: roomData, isLoading: isRoomLoading } = useGetRoomByIdQuery(id);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (roomData?.data) {
      setExistingImages(roomData?.data?.images?.map((img, index) => ({
        uid: `existing-${index}`,
        name: `Image ${index + 1}`,
        status: 'done',
        url: img
      })) || []);
    }
  }, [roomData]);

  const handleImageRemove = (file) => {
    if (file.uid.startsWith('existing-')) {
      setRemovedImages(prev => [...prev, file.url]);
    } else {
      setNewImages(prev => prev.filter(img => img.uid !== file.uid));
    }
  };

  const handleImageChange = (files) => {
    const newFiles = files.filter(file => !file.uid?.startsWith('existing-'));
    setNewImages(newFiles);
  };

  const handleSubmit = async (formData) => {
    try {
      // Check if there are any changes
      const hasImageChanges = removedImages.length > 0 || newImages.length > 0;
      const hasOtherChanges = Object.keys(formData).some(key => {
        if (key === 'images') return false; // We handle images separately
        return JSON.stringify(formData[key]) !== JSON.stringify(roomData?.data[key]);
      });

      if (!hasImageChanges && !hasOtherChanges) {
        message.info('No changes detected');
        return;
      }

      setUploading(true);
      let imageUrls = [...(roomData?.data?.images || [])];

      // Filter out removed images
      imageUrls = imageUrls.filter(img => !removedImages.includes(img));

      // Handle new image uploads if provided
      if (newImages.length > 0) {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

        const uploadPromises = newImages.map(async (image) => {
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

        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const updatedRoomData = {
        hotelId: roomData?.data?.hotelId,
        roomNumber: formData?.roomNumber,
        type: formData?.type,
        price: parseFloat(formData?.price),
        capacity: parseInt(formData?.capacity),
        roomQty: parseInt(formData?.roomQty),
        child: parseInt(formData?.child),
        images: imageUrls,
        amenities: formData?.amenities || [],
        isAvailable: formData?.isAvailable
      };

      await updateRoom({
        id: id,
        data: updatedRoomData
      }).unwrap();
      
      message.success('Room updated successfully!');
      setRemovedImages([]);
      setNewImages([]);

    } catch (error) {
      console.error('Error updating room:', error);
      message.error(error.message || 'Error updating room. Please try again.');
    } finally {
      setUploading(false);
    }
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

  if (isRoomLoading) return <div>Loading room data...</div>;

  return (
    <div className="">
      <Link to={`/admin/view-hotel-details/${roomData?.data?.hotelId}`}>
        <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-end my-5">
          <button className="bg-primary font-Poppins font-medium py-2 px-5 rounded-lg text-white">
            Back
          </button>
        </div>
      </Link>
      
      <ZFormTwo
        isLoading={isLoading || uploading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        formType="edit"
        data={data}
        buttonName="Update Room"
        defaultValues={roomData?.data}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-10">
          {/* Form fields remain the same */}
          <ZInputTwo
            name="roomNumber"
            type="text"
            label="Room Number"
            placeholder="Enter room number"
            required={1}
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
          />

          <ZInputTwo
            name="capacity"
            type="number"
            label="Capacity(Adult)"
            placeholder="Enter room capacity"
  
          />

          <ZInputTwo
                      name="child"
                      type="number"
                      label="Capacity(Child)"
                      placeholder="Enter child  capacity"
  
                      
                    />
                    <ZInputTwo
                      name="roomQty"
                      type="number"
                      label="Room Quantity"
                      placeholder="Enter room quantity"

                      
                    />

          <div className="lg:col-span-2">
            <ZMultipleImage 
              name="images" 
              label="Room Images" 
              maxCount={5}
              defaultValue={existingImages}
              onRemove={handleImageRemove}
              onChange={handleImageChange}
            />
          </div>

          <div className="lg:col-span-2">
            <ZSelect
              name="amenities"
              label="Amenities"
              options={amenitiesOptions}
              placeholder="Select amenities"
              mode="multiple"
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

          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default EditRoom;