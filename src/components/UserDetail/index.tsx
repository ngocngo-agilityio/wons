'use client';

import { memo } from 'react';

// Components
import { Text, Button, ImageFallback } from '@/components';

// Types
interface UserDetailProps {
  avatar: string;
  username: string;
  role: string;
  fullName: string;
  email: string;
  onButtonEditClick: () => void;
}

const UserDetail = ({
  avatar,
  username,
  role,
  fullName,
  email,
  onButtonEditClick,
}: UserDetailProps) => (
  <div className="p-[0_30px_0] w-full gap-[5px_0]">
    <div className="m-[30px_0] flex flex-col sm:flex-row justify-between items-center">
      <div className="sm:flex gap-[0_20px]">
        <div className="relative w-[128px] h-[128px]">
          <ImageFallback
            className="rounded-full object-cover h-full"
            fill
            alt="User Avatar"
            src={avatar}
          />
        </div>

        <div className="flex flex-col justify-center text-center sm:text-left m-[20px_0] sm:m-0">
          <Text
            className="font-bold capitalize"
            size="2xl"
            as="dt"
            text={fullName}
          />
          <Text className="text-gray-900/80" size="md" as="dd" text={role} />
        </div>
      </div>

      <Button
        className="h-fit text-[15px] font-medium md:w-auto py-[10px] px-[25px]"
        type="button"
        color="primary"
        onClick={onButtonEditClick}
      >
        Edit Profile
      </Button>
    </div>

    <div className="flex flex-col gap-[2px_0] p-[15px_0] border-solid border-b-1 border-gray-100">
      <Text className="font-medium" size="xl" as="dt" text="User Name" />
      <Text className="text-gray-900/80" size="md" as="dd" text={username} />
    </div>

    <div className="flex flex-col gap-[2px_0] p-[15px_0] border-solid border-b-1 border-gray-100">
      <Text className="font-medium" size="xl" as="dt" text="Email" />
      <Text className="text-gray-900/80" size="md" as="dd" text={email} />
    </div>
  </div>
);

export default memo(UserDetail);
