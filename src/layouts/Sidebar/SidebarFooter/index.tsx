'use client';

import { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import clsx from 'clsx';

// Constants
import { MESSAGES, ROUTES } from '@/constants';

// Hooks
import { useToast } from '@/hooks';

// Components
import {
  Button,
  ConfirmModal,
  ImageFallback,
  IoLogOut,
  LoadingIndicator,
  Text,
} from '@/components';

// Types
import { Role, SidebarState } from '@/types';

const DynamicThemeSwitcher = dynamic(
  () => import('@/components/ThemeSwitcher'),
  {
    ssr: false,
  },
);

interface ISidebarFooter {
  toggle?: string;
  avatar: string;
  fullName: string;
  role: Role;
  onLogout: () => Promise<void>;
}

const SidebarFooter = ({
  toggle = SidebarState.Open,
  avatar,
  fullName,
  role,
  onLogout,
}: ISidebarFooter) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useToast();

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);

  const handleCancelDelete = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsModalOpen(false);
    setIsPending(true);

    const res = await onLogout();

    if (typeof res === 'string') {
      return showToast({
        status: 'error',
        title: MESSAGES.STATUS.ERROR,
        description: res,
      });
    }

    router.push(ROUTES.SIGN_IN);

    setIsPending(false);
  }, [onLogout, router, showToast]);

  return (
    <>
      {isPending && <LoadingIndicator />}
      <div className="flex flex-col gap-7.5">
        <DynamicThemeSwitcher />
        <div
          className={clsx(
            'flex',
            toggle === SidebarState.Open ? 'justify-between' : 'flex-col gap-3',
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative w-11 h-11">
              <ImageFallback
                fill
                className="rounded-xl object-cover h-full"
                sizes="(min-width: 768px) 100px, 45px"
                src={avatar}
                alt="User Avatar"
              />
            </div>
            {toggle === SidebarState.Open && (
              <div className="flex flex-col">
                <Text text={fullName} className="text-sm capitalize" />
                <Text
                  text={role === Role.User ? 'View-only' : role}
                  className="text-xs opacity-60 capitalize"
                />
              </div>
            )}
          </div>
          <Button
            isIconOnly
            className="bg-transparent dark:bg-transparent hover:bg-transparent w-fit h-fit p-2"
            onClick={handleOpenModal}
            aria-label="Sign out"
          >
            <IoLogOut className="text-blue-800/40 dark:text-white/50 w-5 h-5" />
          </Button>
        </div>
      </div>
      <ConfirmModal
        title="Sign out"
        content="Are you sure you would like to Sign out?"
        isOpen={isModalOpen}
        onConfirm={handleSignOut}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default memo(SidebarFooter);
