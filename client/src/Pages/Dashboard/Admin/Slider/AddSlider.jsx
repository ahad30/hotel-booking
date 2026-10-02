import React from "react";
import { useAppDispatch } from "../../../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../../../redux/Modal/ModalSlice";
import axios from "axios";
import { message } from "antd";
import { useAddSliderMutation } from "../../../../redux/Feature/Admin/slider/sliderApi";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import ZImageInput from "../../../../components/Form/ZImageInput";

const AddSlider = () => {
  const dispatch = useAppDispatch();
  const [createSlider, { isLoading: SIsLoading, isError: SIsError, error: SError, isSuccess: SIsSuccess, data }] = useAddSliderMutation();
  // console.log(data)
  const handleSubmit = async (data) => {
    try {
      let imageUrl = '';

      // Check if image is provided
      if (data?.imageUrl) {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

        const imageFile = new FormData();
        imageFile.append('image', data.imageUrl);

        const res = await axios.post(image_hosting_api, imageFile, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        });

        if (res?.data?.success) {
          imageUrl = res.data.data.display_url;
        } else {
          throw new Error('Image upload failed');
        }
      }

      const formData = {
        title: data?.title || "",
        description: data?.description || "",
        imageUrl: imageUrl || "",  // Use the uploaded URL or an empty string
        linkUrl: data?.linkUrl || "",
        isActive: data?.isActive,
        // createdById: "64b8c4c8d4a7f3d9e0e6e1d4"
      };

      createSlider(formData);

    } catch (error) {
      console.error('Error handling form submission:', error);
      message.error('Error handling form submission. Please try again.');
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen());
  };

  return (
    <div className="">
      <ZFormTwo
        isLoading={SIsLoading}
        isSuccess={SIsSuccess}
        isError={SIsError}
        error={SError}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}
        formType="create"
        data={data}
        buttonName="Create"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          {/* <ZInputTwo
            name="title"
            type="text"
            label="Title"
            defaultKey={""}
            placeholder={"Enter the title"}
            // required={1}
            reset
          />

          <ZInputTwo
            name="description"
            type="text"
            label="Description"
            defaultKey={""}
            placeholder={"Enter the description"}
            reset
          /> */}

          <ZImageInput
            name="imageUrl"
            label="Slider Image"
          />

          {/* <ZInputTwo
            name="linkUrl"
            type="text"
            label="Link URL"
            defaultKey={""}
            placeholder={"Enter the link URL"}
          /> */}

          <ZSelect
            name="isActive"
            label="Status"
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
            placeholder="Select status"
           required={1}
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default AddSlider;