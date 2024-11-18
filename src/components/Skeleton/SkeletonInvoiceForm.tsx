// Components
import { Skeleton } from '@nextui-org/react';
import { SkeletonInvoiceProductTable } from './index';

const SkeletonInputGroup = () => (
  <div className="flex flex-col gap-[8px_0] sm:max-w-[335px]">
    <Skeleton className="max-w-[72px] h-[20px] rounded-[6px]" />
    <Skeleton className="w-full h-[50px] rounded-[10px]" />
  </div>
);

const SkeletonInvoiceForm = () => (
  <div className="m-[0_auto] p-[30px] w-full max-w-[700px] flex flex-col gap-[30px_0]">
    {/* Invoice form's skeleton */}
    <div className="grid grid-cols-1 gap-[20px_0] sm:grid-cols-2 sm:gap-[0_30px] sm:mt-[30px]">
      <SkeletonInputGroup />
      <SkeletonInputGroup />
    </div>

    <div className="grid grid-cols-1 gap-[20px_0] sm:grid-cols-2 sm:gap-[0_30px]">
      <SkeletonInputGroup />
      <SkeletonInputGroup />
    </div>

    <div className="grid grid-cols-1 gap-[20px_0] sm:grid-cols-2 sm:gap-[0_30px]">
      <SkeletonInputGroup />
      <SkeletonInputGroup />
    </div>

    <SkeletonInvoiceProductTable />

    {/* Buttons group */}
    <div className="flex flex-col sm:flex-row base:gap-[20px_0] sm:gap-[0_30px]">
      <Skeleton className="w-full h-[50px] rounded-[10px]" />
      <Skeleton className="w-full h-[50px] rounded-[10px]" />
    </div>
  </div>
);

export default SkeletonInvoiceForm;
