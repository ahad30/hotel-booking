import { Sidebar } from 'primereact/sidebar';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'antd';

const Adjustment = ({ 
  visibleRight, 
  setVisibleRight,
  selectedDivision,
  setSelectedDivision,
  selectedCity,
  setSelectedCity,
  onApplyFilters // Add this new prop
}) => {
  const [divisions, setDivisions] = useState([]);
  const [cities, setCities] = useState([]);
  const [localDivision, setLocalDivision] = useState(selectedDivision);
  const [localCity, setLocalCity] = useState(selectedCity);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000)); // Next day
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);

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
      }
    };
    fetchDivisions();
  }, []);

  // Fetch cities when division is selected
  useEffect(() => {
    if (localDivision) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://bdapi.vercel.app/api/v.1/district/${localDivision}`);
          setCities(response.data.data.map(city => ({
            label: city.name,
            value: city.id
          })));
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setLocalCity('');
    }
  }, [localDivision]);

  const handleApply = () => {
    // Update the parent state with the local selections
    setSelectedDivision(localDivision);
    setSelectedCity(localCity);
    // Trigger the API call via the parent component
    onApplyFilters(localDivision, localCity);
    setVisibleRight(false);
  };

  const handleClearFilters = () => {
    setLocalDivision('');
    setLocalCity('');
    setCities([]);
  };

  return (
    <Sidebar
      visible={visibleRight}
      position="bottom"
      onHide={() => setVisibleRight(false)}
      className="w-full md:w-[500px] h-[300px] lg:h-[380px] mx-auto rounded-t-2xl"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Modify Your Search</h2>
      
      <div className="grid gap-4  overflow-y-auto p-4 mb-14">
        {/* Division Selection */}
        <div className="field">
          <label htmlFor="division" className="block font-medium mb-2">Division</label>
          <Dropdown
            id="division"
            value={localDivision}
            options={divisions}
            onChange={(e) => {
              setLocalDivision(e.value);
              setLocalCity('');
            }}
            optionLabel="label"
            placeholder="Select a Division"
            className="w-full"
          />
        </div>

        {/* City Selection */}
        <div className="field">
          <label htmlFor="city" className="block font-medium mb-2">City/Area</label>
          <Dropdown
            id="city"
            value={localCity}
            options={cities}
            onChange={(e) => setLocalCity(e.value)}
            optionLabel="label"
            placeholder="Select a City"
            className="w-full"
            disabled={!localDivision}
          />
        </div>

                {/* Date Range */}
        {/* <div className="grid grid-cols-2 gap-4">
          <div className="field">
            <label htmlFor="checkIn" className="block font-medium mb-2">Check In</label>
            <Calendar
              id="checkIn"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.value)}
              dateFormat="dd M yy"
              minDate={new Date()}
              className="w-full"
            />
          </div>
          <div className="field">
            <label htmlFor="checkOut" className="block font-medium mb-2">Check Out</label>
            <Calendar
              id="checkOut"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.value)}
              dateFormat="dd M yy"
              minDate={checkInDate}
              className="w-full"
            />
          </div>
        </div> */}

        {/* Guests and Rooms */}
        {/* <div className="grid grid-cols-1  gap-4">
          <div className="field">
            <label htmlFor="guests" className="block font-medium mb-2">Guests</label>
            <InputNumber
              id="guests"
              value={guests}
              onValueChange={(e) => setGuests(e.value)}
              min={1}
              max={20}
              showButtons
              className="w-full"
            />
          </div>
          <div className="field">
            <label htmlFor="rooms" className="block font-medium mb-2">Rooms</label>
            <InputNumber
              id="rooms"
              value={rooms}
              onValueChange={(e) => setRooms(e.value)}
              min={1}
              max={10}
              showButtons
              className="w-full"
            />
          </div>
        </div> */}


      </div>
              {/* Action Buttons */}
      <div className="flex fixed bottom-0 gap-4 py-2  justify-center w-[90%] bg-white rounded-b-2xl shadow-lg  md:w-[450px] mx-auto">
          <Button
            onClick={handleClearFilters}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-all"
          >
            Clear Filters
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-all"
          >
            Apply Filters
          </Button>
        </div>
    </Sidebar>
  );
};

export default Adjustment;