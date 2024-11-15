'use client';

import { memo, useCallback, useState, useTransition, useEffect } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

// Hocs
import { withAccountState } from '@/hocs/withAccountState';

// Hooks
import { useBreakPoints, useToast } from '@/hooks';

// Actions
import { createTask } from '@/actions';

// Constants
import { MESSAGES } from '@/constants';

// Api
import { uploadImage } from '@/api/image';

// Utils
import { formatErrorMessage, preventScrollFromState } from '@/utils';

// Components
import { BsPlus, Button, TaskForm } from '@/components';

// Types
import { TaskWithStringAssignees } from '@/types';

interface TaskDrawerProps {
  isAdmin: boolean;
}

const TaskDrawer = ({ isAdmin }: TaskDrawerProps): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const { isGreaterThanMd } = useBreakPoints();

  const handleOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleFormSubmit = useCallback(
    async (formData: TaskWithStringAssignees) => {
      if (avatarFiles && avatarFiles.length && isAvatarDirty) {
        try {
          const uploadImageResponses = await Promise.all(
            avatarFiles.map((file) => uploadImage(file)),
          );

          const downloadURLs = uploadImageResponses
            .map((response) => response?.downloadURL)
            .filter(Boolean);

          if (downloadURLs.length !== avatarFiles.length) {
            return;
          }

          formData.images = downloadURLs as string[];
        } catch (error) {
          const message = formatErrorMessage(error);
          return { error: message };
        }
      }

      startTransition(async () => {
        const { title, ...restFormData } = formData;
        const { error } = await createTask({
          title,
          ...restFormData,
        });

        showToast({
          description: error ?? MESSAGES.SUCCESS.CREATE_TASK,
          status: error ? MESSAGES.STATUS.ERROR : MESSAGES.STATUS.SUCCESS,
        });
      });

      if (!isPending) {
        setIsDrawerOpen(false);
        setAvatarFiles([]);
      }
    },
    [avatarFiles, isAvatarDirty, isPending, showToast],
  );

  const handleAvatarChange = useCallback((files: File[]) => {
    setAvatarFiles(files);
    setIsAvatarDirty(true);
  }, []);

  useEffect(() => {
    preventScrollFromState(isDrawerOpen);
  }, [isDrawerOpen]);

  return (
    <>
      {isAdmin && (
        <div className="flex flex-col md:flex-row justify-between md:items-center w-full md:w-fit">
          <Button
            startContent={<BsPlus size={22} className="text-white" />}
            color="primary"
            className="base:w-full md:w-[122px] h-10 base:gap-2 md:gap-0.5"
            onClick={handleOpenDrawer}
          >
            Add New Task
          </Button>

          {isDrawerOpen && (
            <Drawer
              open={isDrawerOpen}
              onClose={handleCloseDrawer}
              direction="right"
              size={isGreaterThanMd ? 450 : 375}
            >
              <div className="p-8 bg-white dark:bg-gray-400 h-full max-w-full overflow-y-auto">
                <TaskForm
                  onAvatarChange={handleAvatarChange}
                  onCloseDrawer={handleCloseDrawer}
                  key={isDrawerOpen ? 'open' : 'closed'}
                  onSubmit={handleFormSubmit}
                />
              </div>
            </Drawer>
          )}
        </div>
      )}
    </>
  );
};

export default withAccountState<TaskDrawerProps>(memo(TaskDrawer));
