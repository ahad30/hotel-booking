import { Skeleton } from 'primereact/skeleton';

const SliderSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="border-round border-1 surface-border p-4 surface-card">
          {/* Remove the circle skeleton and adjust the layout */}
          <div className="mb-3">
            <Skeleton width="100%" height="150px" className="mb-2" />
            <Skeleton width="50%" height="1rem" />
            <Skeleton width="30%" height="1.5rem" className="mt-2 mb-2" />
            <Skeleton width="100%" height="1rem" className="mb-2" />
          </div>
        
        </div>
      ))}
    </div>
  );
};

export default SliderSkeleton;