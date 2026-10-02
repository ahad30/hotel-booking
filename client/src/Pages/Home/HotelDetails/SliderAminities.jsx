import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  SafetyOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  FundProjectionScreenOutlined,
  LockOutlined,
  BorderOutlined,
  // SnowflakeOutlined
} from '@ant-design/icons';
import { FaSwimmingPool, FaWineGlassAlt } from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";


// Amenity icons mapping
const amenityIcons = {
  'Free WiFi': <WifiOutlined className="text-blue-500" />,
  'Parking': <CarOutlined className="text-blue-500" />,
  'Restaurant': <CoffeeOutlined className="text-blue-500" />,
  'TV': <FundProjectionScreenOutlined className="text-blue-500" />,
  'Security': <SafetyOutlined className="text-blue-500" />,
  'Gym': <FireOutlined className="text-blue-500" />,
  'Spa': <MedicineBoxOutlined className="text-blue-500" />,
  'Swimming Pool': <FaSwimmingPool className="text-blue-500 text-[22px] lg:text-3xl" />,
  'AC': <TbAirConditioning className="text-blue-500" />,
  'Air Conditioning': <TbAirConditioning className="text-blue-500" />,
  'Mini Bar': <FaWineGlassAlt className="text-blue-500" />,
  'Safe': <LockOutlined className="text-blue-500" />,
  'Balcony': <BorderOutlined className="text-blue-500" />
};


const SliderAminities = ({ amenities = [] , hideText= false}) => {
  return (
    <div className={`amenities-slider-container grid grid-cols-5 lg:grid-cols-6 gap-8 
    ${hideText ? '!grid-cols-6' : ''}`}>
      {/* <Swiper
        slidesPerView={'auto'}
        spaceBetween={30}
        initialSlide={0}
        className="amenities-swiper"
      > */}
        {amenities.map((amenity, index) => (
          //<SwiperSlide key={index} className="amenity-slide">
            <div key={index} className="flex flex-col items-center gap-1 p-2 justify-center">
              <div className="text-sm lg:text-2xl">
                {amenityIcons[amenity] || <span className="text-blue-500">•</span>}
              </div>             
              {!hideText && (
            <div className="text-[8px] lg:text-lg text-gray-600 whitespace-nowrap">
              {amenity}
            </div>
          )}
            </div>
          //</SwiperSlide>
        ))}
      {/* </Swiper> */}
    </div>
  );
};

export default SliderAminities;
