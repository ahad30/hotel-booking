import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../../../redux/Modal/ModalSlice";
import axios from "axios";
import { message, Checkbox, Radio } from "antd";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import ZImageInput from "../../../../components/Form/ZImageInput";
import { useCreateHotelMutation } from "../../../../redux/Feature/Admin/hotel/hotelApi";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import ZInputTextArea from "../../../../components/Form/ZInputTextArea";
import { useGetAreasQuery } from "../../../../redux/Feature/Admin/area/areaApi";
import { Link } from "react-router-dom";

const AddHotel = () => {
  const dispatch = useAppDispatch();
  const [createHotel, { isLoading, isError, error, isSuccess, data }] = useCreateHotelMutation();
  const [divisions, setDivisions] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedAreas, setSelectedAreas] = useState(null);
  const [selectAllAreas, setSelectAllAreas] = useState(false);
  const user = useAppSelector(useCurrentUser);
  
  // Fetch all areas
  const { data: areasData } = useGetAreasQuery();

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
          setSelectedCity(""); // Reset city selection when division changes
          setAreas([]); // Reset areas when division changes
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
      setSelectedAreas([]);  
      setSelectAllAreas(false); // Reset select all when city changes
    }
  }, [selectedCity, areasData]);

  const handleSubmit = async (formData) => {
    try {
      let imageUrl = '';

      if (formData?.image) {
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

      const hotelData = {
        name: formData?.name,
        description: formData?.description,
        location: formData?.location,
        latitude: parseFloat(formData?.latitude),
        longitude: parseFloat(formData?.longitude),
        image: imageUrl || "https://example.com/hotel-image.jpg",
        divisionId: formData?.divisionId,
        cityId: formData?.cityId,
        areaId: (selectedAreas).toString(), 
        amenities: formData?.amenities || [],
        ownerId: user?.id,
        isActive: formData?.isActive || true
      };
      console.log(hotelData )

      // createHotel(hotelData);

    } catch (error) {
      console.error('Error handling form submission:', error);
      message.error('Error handling form submission. Please try again.');
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen());
  };

  // const handleAreaSelection = (id) => {
  //   setSelectedAreas(prev => 
  //     prev.includes(id) 
  //       ? prev.filter(id => id !== id) 
  //       : [...prev, id]
  //   );
  // };

  const handleAreaSelection = (e) => {
    setSelectedAreas(e.target.value);
  };

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
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        // closeModal={handleCloseAndOpen}
        formType="create"
        data={data}
        buttonName="Create Hotel"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-10">
          <div className="lg:col-span-2">
            <ZInputTwo
              name="name"
              type="text"
              label="Hotel Name"
              placeholder="Enter hotel name"
              required={1}
              reset
            />
          </div>
          
          <div className="lg:col-span-2">
            <ZInputTextArea
              name="description"
              type="text"
              label="Description"
              placeholder="Enter hotel description"
              required={1}
              reset
            />
          </div>
          
          <div className="lg:col-span-2">
            <ZInputTwo
              name="location"
              type="text"
              label="Location"
              placeholder="Enter hotel location"
              required={1}
              reset
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
                reset
              />

              <ZInputTwo
                name="longitude"
                type="number"
                label="Longitude"
                placeholder="Enter longitude coordinates"
                required={1}
                reset
              />
            </div>
          </div>

          <ZImageInput
            name="image"
            label="Hotel Image"
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
            required={1}
          />

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

export default AddHotel;