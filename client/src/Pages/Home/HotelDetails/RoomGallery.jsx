import React from 'react';
import { Image, Typography } from 'antd';

const { Title } = Typography;

const RoomImageGallery = ({ rooms }) => {
  // Combine all room images into one array
  const allImages = rooms.flatMap(room => 
    room.images?.map(img => ({ src: img, alt: `${room.type} room` })) || []
  );

  // First 5 images (2 in first row, 3 in second row)
  const displayImages = allImages.slice(0, 6);
  const remainingCount = allImages.length - 6;
  const sixthImage = allImages[6]?.src;

  if (allImages.length === 0) {
    return <div className='text-center font-bold text-red-500'>No images available right now</div>;
  }

  return (
    <div className="mt-3">
      {/* <Title level={3} className="text-center mb-6">
        Explore All Images
      </Title> */}

      <Image.PreviewGroup items={allImages.map(img => img.src)}>
        {/* First row - 2 images */}
        <div className="flex w-full lg:grid lg:grid-cols-3 gap-1 mb-1">
          {displayImages.slice(0, 3).map((image, index) => (

             <Image
              key={index}
              src={image.src}
              alt={image.alt}
              // width={150}
              // height={100}
              className="!w-[130px] !h-[80px] md:!w-full md:!h-[250px] object-cover cursor-pointer"
              // preview={{ mask: null }}
            />

          ))}
        </div>
        
        {/* Second row - 3 images */}
        <div className="flex w-full  lg:grid lg:grid-cols-3 gap-1 mb-1">
          {displayImages.slice(3, 6).map((image, index) => (
            <Image
              key={index + 2}
              src={image.src}
              alt={image.alt}
              // width={100}
              // height={50}
              className="!w-[130px] !h-[80px] md:!w-full md:!h-[250px] object-cover cursor-pointer"
              // preview={{ mask: null }}
            />
          ))}
        </div>
        
        {/* +More tile with 6th image as background */}
        {remainingCount > 0 && sixthImage && (
<div className=''>
<div className="relative md:w-full h-[70px] md:h-[100px] mt-1">
            <Image
              src={sixthImage}
              alt=""
              width="100%"
              className="object-cover !h-[70px] md:!w-full md:!h-[100px] cursor-pointer"
              style={{ filter: 'blur(1px) brightness(0.7)' }}
              preview={{
                src: sixthImage,
                mask: (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xl drop-shadow-md">
                      +{remainingCount} more
                    </span>
                  </div>
                )
              }}
            />
            <div className="absolute inset-0 flex  items-center justify-center pointer-events-none">
              <span className="text-white font-bold text-xl drop-shadow-md">
                +{remainingCount} more
              </span>
            </div>
          </div>
</div>
        )}
      </Image.PreviewGroup>
    </div>
  );
};

export default RoomImageGallery;