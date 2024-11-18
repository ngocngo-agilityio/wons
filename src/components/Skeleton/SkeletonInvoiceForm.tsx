// Components
import { Skeleton } from '@nextui-org/react';

const SkeletonInvoiceForm = () => (
  <div className="m-[0_auto] p-[30px] w-full max-w-[700px] flex flex-col gap-[20px_0]">
    {/* Invoice form's skeleton */}
    <div className="grid grid-cols-1 gap-[20px_0] sm:grid-cols-2 sm:gap-[0_30px] sm:mt-[30px]">
      <div className="flex flex-col gap-[8px_0] sm:max-w-[335px]">
        <Skeleton className="max-w-[72px] h-[20px] rounded-[6px]" />
        <Skeleton className="w-full h-[50px] rounded-[10px]" />
      </div>

      <div className="flex flex-col gap-[8px_0] sm:max-w-[335px]">
        <Skeleton className="max-w-[72px] h-[20px] rounded-[6px]" />
        <Skeleton className="w-full h-[50px] rounded-[10px]" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-[20px_0] sm:grid-cols-2 sm:gap-[0_30px]">
      <div className="flex flex-col gap-[8px_0] sm:max-w-[335px]">
        <Skeleton className="max-w-[72px] h-[20px] rounded-[6px]" />
        <Skeleton className="w-full h-[50px] rounded-[10px]" />
      </div>

      <div className="flex flex-col gap-[8px_0] sm:max-w-[335px]">
        <Skeleton className="max-w-[72px] h-[20px] rounded-[6px]" />
        <Skeleton className="w-full h-[50px] rounded-[10px]" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-[20px_0] sm:grid-cols-2 sm:gap-[0_30px]">
      <div className="flex flex-col gap-[8px_0] sm:max-w-[335px]">
        <Skeleton className="max-w-[72px] h-[20px] rounded-[6px]" />
        <Skeleton className="w-full h-[50px] rounded-[10px]" />
      </div>

      <div className="flex flex-col gap-[8px_0] sm:max-w-[335px]">
        <Skeleton className="max-w-[72px] h-[20px] rounded-[6px]" />
        <Skeleton className="w-full h-[50px] rounded-[10px]" />
      </div>
    </div>

    <div className="w-full h-[130px]">
      {/* Product description's title and button add new's skeletons*/}
      <div className="w-full flex justify-between items-center">
        <Skeleton className="w-[152px] h-[20px] rounded-5" />
        <Skeleton className="w-[30px] h-[30px] rounded-5" />
      </div>

      {/* Table's skeleton on desktop */}
      <div className="base:hidden sm:flex justify-between gap-[0_10px] w-full h-fit overflow-x-auto p-[10px_30px] mt-[20px]">
        <div className="flex flex-col gap-[20px_0]">
          <Skeleton className="w-[100px] h-[20px] rounded-5" />
          <Skeleton className="w-[100px] h-[20px] rounded-5" />
        </div>

        <div className="flex flex-col gap-[20px_0]">
          <Skeleton className="w-[100px] h-[20px] rounded-5" />
          <Skeleton className="w-[100px] h-[20px] rounded-5" />
        </div>

        <div className="flex flex-col gap-[20px_0]">
          <Skeleton className="w-[100px] h-[20px] rounded-5" />
          <Skeleton className="w-[100px] h-[20px] rounded-5" />
        </div>

        <div className="flex flex-col gap-[20px_0]">
          <Skeleton className="w-[100px] h-[20px] rounded-5" />
          <Skeleton className="w-[100px] h-[20px] rounded-5" />
        </div>

        <Skeleton className="-mb-[2px] w-[25px] h-[25px] rounded-full self-end" />
      </div>

      {/* Table's skeleton on mobile */}
      <Skeleton className="mt-[30px] base:block sm:hidden w-full h-[80px] rounded-10" />

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row base:gap-[20px_0] sm:gap-[0_30px] base:mt-5 sm:mt-[30px]">
        <Skeleton className="w-full h-[50px] rounded-[10px]" />
        <Skeleton className="w-full h-[50px] rounded-[10px]" />
      </div>
    </div>
  </div>
);

export default SkeletonInvoiceForm;
