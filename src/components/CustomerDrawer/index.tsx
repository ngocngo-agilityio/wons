'use client';

import { UseFormReset } from 'react-hook-form';
import { useCallback, useState, useTransition } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

// Api
import { uploadImage } from '@/api/image';

// icons
import { IoClose } from 'react-icons/io5';

// Models
import { ICustomer } from '@/models';

// components
import { CustomerForm, Button, BsPlus } from '@/components';

// Constants
import { MESSAGE_STATUS, SUCCESS_MESSAGES } from '@/constants';

// Actions
import { createCustomer } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

const CustomerDrawer = (): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  let formReset: UseFormReset<Partial<ICustomer>> | null = null;

  const handleOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = () => {
    if (formReset) {
      formReset();
    }
    setIsDrawerOpen(false);
  };

  const handleFormSubmit = useCallback(
    async (formData: ICustomer) => {
      if (avatarFile && isAvatarDirty) {
        try {
          const formDataAvatar = new FormData();

          formDataAvatar.append('image', avatarFile);

          const avatar = await uploadImage(formDataAvatar);

          if (typeof avatar === 'string') {
            formData.avatar = avatar;
          } else {
            return { error: avatar.error };
          }
        } catch (error) {
          return error;
        }
      }

      startTransition(async () => {
        const { error } = await createCustomer({
          ...formData,
          fullName: `${formData.firstName} ${formData.lastName}`,
        });

        if (error) {
          return showToast({
            description: error,
            status: MESSAGE_STATUS.ERROR,
          });
        } else {
          showToast({
            description: SUCCESS_MESSAGES.CREATE_CUSTOMER,
            status: MESSAGE_STATUS.SUCCESS,
          });
        }
      });

      if (!isPending) {
        setIsDrawerOpen(false);
        setAvatarFile(undefined);
      }
    },
    [avatarFile, isAvatarDirty, isPending, showToast],
  );

  const handleAvatarChange = useCallback((avatarFile: File) => {
    setAvatarFile(avatarFile);
    setIsAvatarDirty(true);
  }, []);

  return (
    <div className="w-full flex justify-center md:justify-end">
      <Button
        color="primary"
        startContent={<BsPlus size={22} className="text-white" />}
        className="text-xl font-medium md:w-auto h-10 px-2.5 w-full mt-3 md:mt-0"
        onClick={handleOpenDrawer}
      >
        Add Customer
      </Button>
      <Drawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        direction="right"
        size={400}
        className="!w-full md:!w-[400px]"
      >
        <div className="p-5 relative bg-white dark:bg-gray-400 h-full max-w-full">
          <Button
            onClick={handleCloseDrawer}
            className="absolute top-5 right-5 !bg-pink-50 dark:!bg-pink-600 text-pink-500 dark:text-pink-500 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer !px-0"
          >
            <IoClose size={20} />
          </Button>
          <CustomerForm
            isDisabledField={isPending}
            onSubmit={handleFormSubmit}
            onAvatarChange={handleAvatarChange}
            setReset={(
              resetFn: UseFormReset<Partial<ICustomer>> | null,
            ): void => {
              formReset = resetFn;
            }}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default CustomerDrawer;