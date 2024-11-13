'use client';

import { memo, useState, useCallback, useTransition } from 'react';
import { useSession } from 'next-auth/react';

// Constants
import { IMAGES, ROLES, MESSAGES } from '@/constants';

// Hooks
import { useToast } from '@/hooks';

// Utils
import { handleUpdateImage } from '@/utils';

// Components
import { UserDetailForm, UserDetail, LoadingIndicator } from '@/components';

// Types
import { IUserFormData } from '@/types';

interface UserDetailClientProps {
  user: IUserFormData;
  id: number;
  onEdit: (
    payload: Omit<IUserFormData, 'role'>,
    id: number,
  ) => Promise<{ success?: boolean; error?: string }>;
}

const UserDetailClient = ({ user, id, onEdit }: UserDetailClientProps) => {
  // States
  const [showEditForm, setShowEditForm] = useState(false);
  const { showToast } = useToast();
  const [avatarFile, setAvatarFile] = useState<File>();
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const {
    avatar = IMAGES.AVATAR_DEFAULT,
    fullName = '',
    username = '',
    email = '',
    role = ROLES[0].name,
  } = user ?? {};

  const handleEditFormToggle = () => {
    setShowEditForm((prevValue) => !prevValue);
  };

  const handleAvatarChange = useCallback((file: File) => {
    setAvatarFile(file);
    setIsAvatarDirty(true);
  }, []);

  const handleEditUserDetail = useCallback(
    async (formData: IUserFormData) => {
      // Handle update User's avatar
      if (avatarFile && isAvatarDirty) {
        const { url = '' } = await handleUpdateImage(avatarFile);

        formData.avatar = url;
      }

      // Update update user's profile
      startTransition(async () => {
        const { error } = await onEdit(
          {
            avatar: formData.avatar,
            fullName: formData.fullName,
            email: formData.email,
            username: formData.username,
          },
          id,
        );

        showToast({
          description: error ?? MESSAGES.SUCCESS.UPDATE_PROFILE,
          status: error ? MESSAGES.STATUS.ERROR : MESSAGES.STATUS.SUCCESS,
        });

        await update({
          avatar: formData.avatar,
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
        });
      });

      if (!isPending) {
        setAvatarFile(undefined);
        setIsAvatarDirty(false);
      }
    },
    [avatarFile, id, isAvatarDirty, isPending, onEdit, showToast, update],
  );

  return (
    <>
      {isPending ? (
        <LoadingIndicator />
      ) : (
        <div className="flex flex-col justify-center items-center pb-[60px] bg-white dark:bg-gray-800 rounded-lg">
          <div className="bg-blue-500 w-full h-14 rounded-tl-lg rounded-tr-lg bg-gradient-to-r from-blue-500 to-blue-300" />
          {showEditForm ? (
            <UserDetailForm
              user={user}
              onAvatarChange={handleAvatarChange}
              onSubmit={handleEditUserDetail}
              onCancel={handleEditFormToggle}
            />
          ) : (
            <UserDetail
              avatar={avatar}
              username={username}
              role={role}
              fullName={fullName}
              email={email}
              onButtonEditClick={handleEditFormToggle}
            />
          )}
        </div>
      )}
    </>
  );
};

export default memo(UserDetailClient);
