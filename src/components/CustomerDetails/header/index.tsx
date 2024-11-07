import { memo } from 'react';

// Components
import { ImageFallback, Text } from '@/components/common';

interface ICustomerDetailsHeader {
  avatar: string;
  firstName: string;
  lastName: string;
  fullName: string;
  job: string;
}

const CustomerDetailsHeader = ({
  avatar,
  firstName,
  fullName,
  job,
  lastName,
}: ICustomerDetailsHeader) => (
  <div className="flex flex-col items-center gap-4 border-b-1 border-blue-800/10 dark:border-white/10 pb-7.5">
    <div className="relative w-[70px] h-[70px]">
      <ImageFallback
        fill
        priority={false}
        src={avatar}
        alt={`${firstName}-${lastName}`}
        sizes="70px"
        className="object-cover rounded-full h-full"
      />
    </div>

    <div className="flex flex-col items-center">
      <Text text={fullName} size="3xl" className="font-bold" />
      {job && <Text text={job} size="md" />}
    </div>
  </div>
);

export default memo(CustomerDetailsHeader);
