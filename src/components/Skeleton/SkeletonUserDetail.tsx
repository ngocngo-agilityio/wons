// Components
import { Skeleton } from '@nextui-org/react';

const SkeletonUserDetail = () => (
  <div className="p-[0_30px_0] w-full gap-[5px_0]">
    <div className="m-[30px_0] flex flex-col sm:flex-row justify-between items-center">
      <div className="flex flex-col sm:flex-row gap-[0_20px]">
        <div className="relative flex justify-center w-full h-fit">
          <Skeleton className="rounded-full w-32 h-32" />
        </div>

        <div className="flex flex-col justify-center items-center sm:items-start m-[20px_0] gap-[5px_0] sm:m-0">
          <Skeleton className="w-[200px] h-4 rounded" />
          <Skeleton className="w-[100px] h-4 rounded" />
        </div>
      </div>

      <Skeleton className="w-[130px] h-12 rounded-10" />
    </div>

    <div className="flex flex-col gap-[5px_0] p-[15px_0] border-solid">
      <Skeleton className="w-[200px] h-4 rounded" />
      <Skeleton className="w-[100px] h-4 rounded" />
    </div>

    <div className="flex flex-col gap-[5px_0] p-[15px_0] border-solid">
      <Skeleton className="w-[200px] h-4 rounded" />
      <Skeleton className="w-[100px] h-4 rounded" />
    </div>
  </div>
);

export default SkeletonUserDetail;
