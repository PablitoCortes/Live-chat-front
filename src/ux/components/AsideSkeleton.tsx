import Skeleton from "@/components/Skeleton/Skeleton";

const AsideSkeleton = () => {
  const header = (
    <div className="p-4 min-h-[8%]">
      <Skeleton className="w-32 h-6 mb-2" />
    </div>
  );

  const search = (
    <div className="px-4 mb-4">
      <Skeleton className="w-full h-10 rounded-lg" />
    </div>
  );

  const list = (
    <div className="px-4 flex flex-col gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-w-[25%] md:min-w-[465px] flex justify-center bg-primary">
      <aside className="w-[90%] flex flex-col min-h-[100%]">
        {header}
        {search}
        {list}
      </aside>
    </div>
  );
};

export default AsideSkeleton;
