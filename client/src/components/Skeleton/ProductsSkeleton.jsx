import { Skeleton } from 'primereact/skeleton';

const ProductsSkeleton = ({ hotelData, viewMode = 'grid' }) => {
  console.log(hotelData)
  // Default skeleton items if no hotelData provided
  const skeletonItems = Array.from({ length: hotelData?.length || 6 });

  return (
    <>
      {/* Desktop View - Supports both grid and list modes */}
      <div className="hidden md:block">
        {viewMode === 'grid' ? (
          // Grid View Skeleton
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {skeletonItems.map((_, index) => (
              <div key={index} className="border-round border-1 surface-border p-4 surface-card">
                <div className="mb-3">
                  <Skeleton width="100%" height="270px" className="mb-3" />
                  <Skeleton width="70%" height="1.5rem" className="mb-2" />
                  <Skeleton width="50%" height="1rem" className="mb-3" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton width="30%" height="1.5rem" />
                    <Skeleton width="25%" height="1.5rem" />
                  </div>
                  <Skeleton width="100%" height="2.5rem" borderRadius="6px" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View Skeleton
          <div className="space-y-4">
            {skeletonItems.map((_, index) => (
              <div key={index} className="flex flex-row h-48 border-round border-1 surface-border surface-card overflow-hidden">
                {/* Image Skeleton */}
                <div className="w-1/3 h-full">
                  <Skeleton width="100%" height="100%" className="rounded-none" />
                </div>
                
                {/* Content Skeleton */}
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <Skeleton width="60%" height="1.5rem" className="mb-2" />
                    <Skeleton width="40%" height="1rem" className="mb-3" />
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Skeleton width="20%" height="1.5rem" />
                      <Skeleton width="25%" height="1.5rem" />
                      <Skeleton width="22%" height="1.5rem" />
                      <Skeleton width="18%" height="1.5rem" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton width="30%" height="1.5rem" />
                    <Skeleton width="25%" height="2.5rem" borderRadius="6px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile View - Always grid mode (2 columns) */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {skeletonItems.map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Image placeholder */}
            <Skeleton 
              width="100%" 
              height="110px" 
              className="rounded-none" 
            />
            
            {/* Content area */}
            <div className="p-2">
              {/* Hotel name (short) */}
              <Skeleton 
                width="80%" 
                height="16px" 
                className="mb-1" 
              />
              
              {/* Location (shorter) */}
              <Skeleton 
                width="60%" 
                height="12px" 
                className="mb-2" 
              />
              
              {/* "Choose Room" button */}
              <Skeleton 
                width="100%" 
                height="28px" 
                borderRadius="6px"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductsSkeleton;