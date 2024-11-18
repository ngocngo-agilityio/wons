// Components
import { Skeleton } from '@nextui-org/react';

const SkeletonTableColumn = () => (
  <div className="flex flex-col gap-[20px_0]">
    <Skeleton className="w-[100px] h-[20px] rounded-5" />
    <Skeleton className="w-[100px] h-[20px] rounded-5" />
  </div>
);

const SkeletonInvoiceProductTable = () => (
  <div className="w-full">
    {/* Product description's title and button add new's skeletons*/}
    <div className="w-full flex justify-between items-center">
      <Skeleton className="w-[152px] h-[20px] rounded-5" />
      <Skeleton className="w-[30px] h-[30px] rounded-5" />
    </div>

    {/* Table's skeleton on desktop */}
    <div className="base:hidden sm:flex justify-between gap-[0_10px] w-full h-fit overflow-x-auto p-[10px_30px] mt-[20px]">
      <SkeletonTableColumn />
      <SkeletonTableColumn />
      <SkeletonTableColumn />
      <SkeletonTableColumn />

      {/* Skeleton button remove */}
      <Skeleton className="-mb-[2px] w-[25px] h-[25px] rounded-full self-end" />
    </div>

    {/* Table's skeleton on mobile */}
    <Skeleton className="mt-[20px] base:block sm:hidden w-full h-[100px] rounded-10" />
  </div>
);

export default SkeletonInvoiceProductTable;
