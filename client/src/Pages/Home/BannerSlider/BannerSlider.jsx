import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useGetSlidersQuery } from "../../../redux/Feature/Admin/slider/sliderApi";
import { Spin } from "antd";
import Skeleton from "../../../components/Skeleton/Skeleton";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";


const BannerSlider = () => {
  const { data, error, isLoading: sliderIsLoading , isFetching } = useGetSlidersQuery();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (isFetching || sliderIsLoading) {
      setShowSkeleton(true);
    } else {
        setShowSkeleton(false);
    }
  }, [isFetching , sliderIsLoading]);
  


  if (error) {
    return <div>Error loading sliders: {error.message}</div>;
  }

  // Ensure data?.data is an array before mapping
  const sliders = data?.data.filter((item) => item?.isActive === true) || [];

  // Format the sliders data for react-image-gallery
  const galleryImages = sliders.map((slider) => ({
    original: slider.imageUrl,
    thumbnail: slider.imageUrl, // Optional: Add thumbnails if needed
    originalAlt: slider.title || "Banner",
    thumbnailAlt: slider.title || "Banner Thumbnail",
  }));

  return (
    <div className="mb-[30px]">
     <SectionTitle title="Offer available on hotels" />
          {
            sliderIsLoading || showSkeleton ? 
          <Skeleton />
          :
          <>
      <ImageGallery
        // className="w-full !h-[300px] md:!h-[400px] lg:!h-[500px]"
        items={galleryImages}
        autoPlay={true}
        slideInterval={8000}
        showThumbnails={false} 
        showFullscreenButton={false} 
        showPlayButton={false} 
        showNav={true} 
        infinite={true} 
        lazyLoad={true} 

      />
        </>
      }
    </div>
  );
};

export default BannerSlider;