'use client';

import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Modal as NextModal, ModalContent } from '@nextui-org/react';

// Types
import { StrapiModel, TLabelStatus, Level } from '@/types';

// Models
import { TUser } from '@/models';

// Components
import { Heading, Text } from '../common';
import LevelChip from '../LevelChip';
import AvatarGroup from '../AvatarGroup';
import TaskStatusComponent from '../TaskStatus';

export interface TaskDetailProps {
  title: string;
  level: Level;
  description: string;
  assignees: { data: Array<StrapiModel<Omit<TUser, 'id'>>> };
  renderImages: () => JSX.Element;
  label: TLabelStatus;
  isOpen: boolean;
  onCloseModal: () => void;
  imageCount: number;
}

const TaskDetail = ({
  title,
  level,
  description,
  assignees,
  renderImages,
  label,
  isOpen,
  onCloseModal,
  imageCount,
}: TaskDetailProps) => {
  const renderLabelImage = imageCount > 1 ? 'Images' : 'Image';

  return (
    <NextModal
      className="max-w-[467px]"
      isOpen={isOpen}
      onOpenChange={onCloseModal}
    >
      <ModalContent className="relative top-0 left-0 p-[30px_30px_40px] bg-white dark:bg-gray-800 rounded-[10px] shadow-[ -14px_30px_20px_0px_rgba(0,0,0,0.05)] w-[467px]">
        <Heading title="Task Details" className="mb-8" />
        <div className="grid grid-cols-1 bg-red w-full">
          <div className="flex flex-row justify-between w-full mb-5">
            <Text className="text-md sm:text-xl w-[35%]" text="Title" />
            <Text
              className="text-md sm:text-xl w-[65%] truncate"
              text={title}
            />
          </div>
          <div className="flex flex-row justify-between w-full mb-5">
            <Text className="text-md sm:text-xl w-[35%]" text="Status" />
            <div className="text-md sm:text-xl w-[65%]">
              <TaskStatusComponent status={label} />
            </div>
          </div>
          <div className="flex flex-row justify-between w-full mb-5">
            <Text className="text-md sm:text-xl w-[35%]" text="Level" />
            <div className="text-md sm:text-xl w-[65%]">
              <LevelChip level={level} size="sm" />
            </div>
          </div>
          <div className="flex flex-row justify-between w-full mb-5">
            <Text className="text-md sm:text-xl w-[35%]" text="Description" />
            <Text
              className="text-md sm:text-xl w-[65%] text-justify line-clamp-[10]"
              text={description}
            />
          </div>
          <div className="flex flex-row justify-between w-full mb-5">
            <Text className="text-md sm:text-xl w-[35%]" text="Assignees" />
            <div className="text-md sm:text-xl w-[65%]">
              <AvatarGroup users={assignees.data} />
            </div>
          </div>
          {Boolean(imageCount) && (
            <div className="flex flex-row justify-between w-full mb-5">
              <Text
                className="text-md sm:text-xl w-[35%]"
                text={renderLabelImage}
              />
              <div className="text-md sm:text-xl w-[65%]">{renderImages()}</div>
            </div>
          )}
        </div>
      </ModalContent>
    </NextModal>
  );
};

export default memo(TaskDetail, isEqual) as <T>(
  props: TaskDetailProps & T,
) => JSX.Element;
