'use client';

import { useCallback, useState, useTransition, useEffect } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

// Models
import { ICustomer } from '@/models';

// components
import { CustomerForm, Button, BsPlus } from '@/components';

// Constants
import { MESSAGES } from '@/constants';

// Actions
import { createCustomer } from '@/actions';

// Hooks
import { useBreakPoints, useToast } from '@/hooks';

// Utils
import {
  formatPhoneNumberTyping,
  handleUpdateImage,
  preventScrollFromState,
} from '@/utils';

const CustomerDrawer = (): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const { isGreaterThanMd } = useBreakPoints();

  const lockScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const handleOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    lockScroll();
  }, [lockScroll]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    unlockScroll();
  }, [unlockScroll]);

  const handleFormSubmit = useCallback(
    async (formData: ICustomer) => {
      if (avatarFile && isAvatarDirty) {
        const { url = '' } = await handleUpdateImage(avatarFile);

        formData.avatar = url;
      }

      startTransition(async () => {
        const { error } = await createCustomer({
          ...formData,
          phone: formatPhoneNumberTyping(formData.phone),
          fullName: `${formData.firstName} ${formData.lastName}`,
        });

        showToast({
          description: error ?? MESSAGES.SUCCESS.CREATE_CUSTOMER,
          status: error ? MESSAGES.STATUS.ERROR : MESSAGES.STATUS.SUCCESS,
        });
      });

      setIsDrawerOpen(false);
      setAvatarFile(undefined);
      unlockScroll();
    },
    [avatarFile, isAvatarDirty, showToast, unlockScroll],
  );

  const handleAvatarChange = useCallback((avatarFile: File) => {
    setAvatarFile(avatarFile);
    setIsAvatarDirty(true);
  }, []);

  useEffect(() => {
    preventScrollFromState(isDrawerOpen);
  }, [isDrawerOpen]);

  return (
    <div className="w-full flex justify-center md:justify-end">
      <Button
        color="primary"
        startContent={<BsPlus size={22} className="text-white" />}
        className="text-xl font-medium md:w-auto h-10 px-2.5 w-full mt-10 md:mt-0"
        onClick={handleOpenDrawer}
      >
        Add Customer
      </Button>
      {isDrawerOpen && (
        <Drawer
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
          direction="right"
          size={isGreaterThanMd ? 450 : 375}
        >
          <div
            data-testid="customer-drawer"
            className="p-8 bg-white dark:bg-gray-400 h-full max-w-full overflow-y-auto"
          >
            <CustomerForm
              onCloseDrawer={handleCloseDrawer}
              key={isDrawerOpen ? 'open' : 'closed'}
              isDisabledField={isPending}
              onSubmit={handleFormSubmit}
              onAvatarChange={handleAvatarChange}
            />
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default CustomerDrawer;
