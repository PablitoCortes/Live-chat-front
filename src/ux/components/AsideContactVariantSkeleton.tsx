import Skeleton from "@/components/Skeleton/Skeleton"

const AsideContactVariantSkeleton = () => {
  return (
    <>
      <div className="px-4 mb-4">
        <Skeleton className="h-10 w-full rounded-lg"/>
      </div>
      <div className="px-4 flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex h-[72px] items-center px-4">
            <Skeleton className="w-12 h-12 rounded-full mr-4"/>
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2"/>
              <Skeleton className="h-3 w-1/2"/>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AsideContactVariantSkeleton