import { useEffect, useState } from "react";
import AllHotel from "./AllHotel/AllHotel";
import BannerSlider from "./BannerSlider/BannerSlider";
import Division from "./Home-Division/HomeDivision";


const Home = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="">
       {/* <Division/> */}
       <BannerSlider />
       <AllHotel/>

    </div>
  );
};

export default Home;
