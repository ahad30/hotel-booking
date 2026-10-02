import { useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../../../../redux/Hook/Hook";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZImageInput from "../../../../components/Form/ZImageInput";
import ZSelect from "../../../../components/Form/ZSelect";
import { useUpdateSliderMutation } from "../../../../redux/Feature/Admin/slider/sliderApi";
import { toast } from "sonner";
import { setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";

const EditSlider = ({ selectedSlider }) => {
  const dispatch = useAppDispatch();
  const [updateSlider, { isLoading: SIsLoading, isError: SIsError, error: SError, isSuccess: SIsSuccess }] = useUpdateSliderMutation();
  
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
  
    try {
      let imageUrl = selectedSlider?.imageUrl;
  
      // Handle new image upload
      if (formData?.imageUrl && !isImageRemoved) {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  
        const imageFile = new FormData();
        imageFile.append("image", formData.imageUrl);
  
        const res = await axios.post(image_hosting_api, imageFile);
  
        if (res?.data?.success) {
          imageUrl = res.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      }
  
      // Handle image removal
      if (!formData?.imageUrl && isImageRemoved) {
        imageUrl = ""; 
      }
  
      // Prepare slider data for API
      const sliderData = {
        title: formData?.title,
        description: formData?.description,
        imageUrl: imageUrl, // Send updated image or empty string
        linkUrl: formData?.linkUrl,
        isActive: formData?.isActive,
      };
  
      // console.log("Updating slider with data:", sliderData);
  
      // Update slider with API
      await updateSlider({ id: selectedSlider.id, data: sliderData }).unwrap();
  
      toast.success("Slider Updated Successfully");
      handleCloseAndOpen();
    } catch (error) {
      console.error("Error updating slider:", error);
      toast.error(error.message || "Error updating slider. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsEditModalOpen()); // Close the edit modal
  };

  return (
    <div className="">
      <ZFormTwo
        isError={SIsError}
        error={SError}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}  
        formType="edit"  
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          <ZInputTwo
            value={selectedSlider?.title}
            name="title"
            type="text"
            label="Title"
            placeholder={"Enter the title"}
          />

          <ZInputTwo
            value={selectedSlider?.description}
            name="description"
            type="text"
            label="Description"
            placeholder={"Enter the description"}
          />

          <ZImageInput
            name="imageUrl"
            label="Slider Image"
            onRemove={() => setIsImageRemoved(true)} 
            onChange={() =>  setIsImageRemoved(false)} 
            defaultValue={selectedSlider?.imageUrl ? [
              {
                uid: '-1',
                name: 'Previous Image',
                status: 'done',
                url: selectedSlider?.imageUrl,
              },
            ] : []}
          />

          <ZInputTwo
            value={selectedSlider?.linkUrl}
            name="linkUrl"
            type="text"
            label="Link URL"
            placeholder={"Enter the link URL"}
          />

          <ZSelect
            name="isActive"
            label="Status"
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
            placeholder="Select status"
            value={selectedSlider?.isActive}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </ZFormTwo>
    </div>
  );
};

export default EditSlider;