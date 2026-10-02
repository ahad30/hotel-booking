import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";
import axios from "axios";
import { message, Checkbox, Radio } from "antd";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import ZImageInput from "../../../../components/Form/ZImageInput";
import { useUpdateHotelMutation, useGetHotelByIdQuery } from "../../../../redux/Feature/Admin/hotel/hotelApi";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import ZInputTextArea from "../../../../components/Form/ZInputTextArea";
import { Link, useParams } from "react-router-dom";
import { useGetAreasQuery } from "../../../../redux/Feature/Admin/area/areaApi";

const EditHotel = () => {
  const { id } = useParams();
  const [updateHotel, { isLoading, isError, error, isSuccess, data }] = useUpdateHotelMutation();
  const { data: hotelData, isLoading: isHotelLoading } = useGetHotelByIdQuery(id);
  const { data: areasData } = useGetAreasQuery();
  const [divisions, setDivisions] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAreas, setSelectedAreas] = useState(null);
  const [selectAllAreas, setSelectAllAreas] = useState(false);
  const user = useAppSelector(useCurrentUser);
  const [uploading, setUploading] = useState(false);

  // Fetch divisions on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get("https://bdapi.vercel.app/api/v.1/division");
        setDivisions(response.data.data.map(div => ({
          label: div.name,
          value: div.id
        })));
      } catch (error) {
        console.error("Error fetching divisions:", error);
        message.error("Failed to load divisions");
      }
    };
    fetchDivisions();
  }, []);

  // Set initial values when hotel data loads
  useEffect(() => {
    if (hotelData?.data) {
      setSelectedDivision(hotelData.data.divisionId);
      setSelectedCity(hotelData.data.cityId);
      setSelectedAreas(hotelData?.data?.areaId ? hotelData.data.areaId : "");
    }
  }, [hotelData]);

  // Fetch cities when division is selected
  useEffect(() => {
    if (selectedDivision) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://bdapi.vercel.app/api/v.1/district/${selectedDivision}`);
          setCities(response.data.data.map(city => ({
            label: city.name,
            value: city.id
          })));
        } catch (error) {
          console.error("Error fetching cities:", error);
          message.error("Failed to load cities");
        }
      };
      fetchCities();
    }
  }, [selectedDivision]);

  // Filter areas when city is selected
  useEffect(() => {
    if (selectedCity && areasData?.data) {
      const filteredAreas = areasData.data.filter(
        area => area.district_id?.toString() === selectedCity.toString()
      );
      setAreas(filteredAreas);
      
      // Update select all state based on current selection
      if (filteredAreas.length > 0) {
        const allSelected = filteredAreas.every(area => 
          selectedAreas.includes(area.id)
        );
        setSelectAllAreas(allSelected);
      }
    }
  }, [selectedCity, areasData, selectedAreas]);

  const handleSubmit = async (formData) => {
    try {
      setUploading(true);
      let imageUrl = hotelData?.data?.image;

      // Handle image upload if a new image is provided
      if (formData?.image && typeof formData.image !== 'string') {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

        const imageFile = new FormData();
        imageFile.append('image', formData.image);

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

      const updatedHotelData = {
        name: formData?.name,
        description: formData?.description,
        location: formData?.location,
        latitude: parseFloat(formData?.latitude),
        longitude: parseFloat(formData?.longitude),
        image: imageUrl,
        divisionId: formData?.divisionId,
        cityId: formData?.cityId,
        areaId: (selectedAreas).toString(), 
        amenities: formData?.amenities || [],
        ownerId: user?.id,
        isActive: formData?.isActive
      };

      // console.log(updatedHotelData)

      await updateHotel({
        id: id,
        data: updatedHotelData
      }).unwrap();

      message.success('Hotel updated successfully!');

    } catch (error) {
      console.error('Error updating hotel:', error);
      message.error(error.message || 'Error updating hotel. Please try again.');
    } finally {
      setUploading(false);
    }
  };

//   const handleAreaSelection = (id) => {
//   setSelectedAreas(prev => {
//     const currentSelection = Array.isArray(prev) ? prev : [];
//     return currentSelection.includes(id) 
//       ? currentSelection.filter(id => id !== id) 
//       : [...currentSelection, id];
//   });
// };

const handleAreaSelection = (e) => {
  setSelectedAreas(e.target.value);
};

// 4. Update the select all handler similarly
const handleSelectAllAreas = (e) => {
  const checked = e.target.checked;
  setSelectAllAreas(checked);
  setSelectedAreas(checked ? areas.map(area => area.id) : []);
};

  const amenitiesOptions = [
    { label: "Free WiFi", value: "Free WiFi" },
    { label: "Swimming Pool", value: "Swimming Pool" },
    { label: "Spa", value: "Spa" },
    { label: "Gym", value: "Gym" },
    { label: "Restaurant", value: "Restaurant" },
  ];

  if (isHotelLoading) return <div>Loading hotel data...</div>;

  return (
    <div className="">
      <Link to={`/admin/hotels`}>
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
        buttonName="Update Hotel"
        defaultValues={hotelData?.data}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-10">
          <div className="lg:col-span-2">
            <ZInputTwo
              name="name"
              type="text"
              label="Hotel Name"
              placeholder="Enter hotel name"
              required={1}
            />
          </div>
          
          <div className="lg:col-span-2">
            <ZInputTextArea
              name="description"
              type="text"
              label="Description"
              placeholder="Enter hotel description"
              required={1}
            />
          </div>
          
          <div className="lg:col-span-2">
            <ZInputTwo
              name="location"
              type="text"
              label="Location"
              placeholder="Enter hotel location"
              required={1}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <ZInputTwo
                name="latitude"
                type="number"
                label="Latitude"
                placeholder="Enter latitude coordinates"
                required={1}
              />

              <ZInputTwo
                name="longitude"
                type="number"
                label="Longitude"
                placeholder="Enter longitude coordinates"
                required={1}
              />
            </div>
          </div>

          <ZImageInput
            name="image"
            label="Hotel Image"
            defaultValue={hotelData?.data?.image ? [{
              uid: '-1',
              name: 'Current Image',
              status: 'done',
              url: hotelData?.data?.image
            }] : []}
          />

          <ZSelect
            name="divisionId"
            label="Division"
            options={divisions}
            placeholder="Select division"
            required={1}
            onChange={(value) => setSelectedDivision(value)}
          />

          <ZSelect
            name="cityId"
            label="City"
            options={cities}
            placeholder="Select city"
            required={1}
            disabled={!selectedDivision}
            onChange={(value) => setSelectedCity(value)}
          />

          {areas.length > 0 && (
            <div className="lg:col-span-2 space-y-2">
              {/* <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Areas</label>
                <Checkbox
                  checked={selectAllAreas}
                  onChange={handleSelectAllAreas}
                >
                  Select All
                </Checkbox>
              </div> */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                {/* {areas.map(area => (
                  <Checkbox
                    key={area.id}
                    checked={selectedAreas.includes(area.id)}
                    onChange={() => handleAreaSelection(area.id)}
                    className="m-1"
                    // value={area.serialId}
                  >
                    {area.name}
                  </Checkbox>
                ))} */}
                   <Radio.Group 
                        onChange={handleAreaSelection} 
                        value={selectedAreas}
                      >
                        {areas.map(area => (
                          <Radio 
                            key={area.id} 
                            value={area.id}
                            className="m-1"
                          >
                            {area.name}
                          </Radio>
                        ))}
                      </Radio.Group>
              </div>
            </div>
          )}

          <ZSelect
            name="amenities"
            label="Amenities"
            options={amenitiesOptions}
            placeholder="Select amenities"
            mode="multiple"
          />

          <ZSelect
            name="isActive"
            label="Status"
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
            placeholder="Select status"
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default EditHotel;