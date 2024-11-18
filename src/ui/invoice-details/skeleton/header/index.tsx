import { Skeleton } from '@nextui-org/react';

// Components
import { ImageFallback, Text } from '@/components';

// Constants
import { IMAGES } from '@/constants';

const InvoiceDetailsHeaderSkeleton = () => (
  <header className="flex items-center justify-between bg-gray-50 dark:bg-blue-800 base:px-2 md:pl-7.5 md:pr-5 pb-6.5 pt-10">
    <div className="flex flex-col gap-[37px]">
      <ImageFallback
        src={IMAGES.LOGO_COMPANY}
        placeholder={null}
        alt="logo-detail"
        width={30}
        height={44}
      />
      <div className="flex flex-col gap-[15px]">
        <Text text="Recipient" size="3xs" className="uppercase font-bold" />

        <div className="flex flex-col gap-1">
          <Skeleton className="flex w-16 h-3 rounded-5" />
          <Skeleton className="flex w-16 h-3 rounded-5" />
          <Skeleton className="flex w-16 h-3 rounded-5" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <Text text="@" size="3xs" className="text text-blue-500" />
            <Skeleton className="flex w-16 h-3 rounded-5" />
          </div>

          <div className="flex items-center gap-2.5">
            <Text text="m" size="3xs" className="text text-blue-500" />
            <Skeleton className="flex w-16 h-3 rounded-5" />
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col items-end gap-[26px]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <Text text="@" size="3xs" className="text text-blue-500" />
          <Skeleton className="flex w-16 h-3 rounded-5" />
        </div>

        <div className="flex items-center gap-2.5">
          <Text text="m" size="3xs" className="text text-blue-500" />
          <Skeleton className="flex w-16 h-3 rounded-5" />
        </div>
      </div>

      <div className="flex flex-col gap-[15px]">
        <Text text="Invoice" size="3xl" className="font-bold" />

        <div className="flex flex-col">
          <Text text="invoice no." size="2xs" />
          <Skeleton className="flex w-16 h-3 rounded-5" />
        </div>

        <div className="flex flex-col">
          <Text text="Invoice date" size="2xs" />
          <Skeleton className="flex w-16 h-3 rounded-5" />
        </div>
      </div>
    </div>
  </header>
);

export default InvoiceDetailsHeaderSkeleton;
