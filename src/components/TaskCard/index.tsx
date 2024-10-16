'use client';

import { memo, useCallback, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import dynamic from 'next/dynamic';

// Types
import { StrapiModel, Task } from '@/types';

// Components
import {
  LevelChip,
  DropdownActions,
  AvatarGroup,
  Text,
  ImageFallback,
  LoadingIndicator,
} from '@/components';

// Constants
import { Level, MESSAGE_STATUS, SUCCESS_MESSAGES } from '@/constants';

// Actions
import { deleteTask, getTaskDetails } from '@/actions';

// Hooks
import { useToast } from '@/hooks';

const DynamicTaskDetails = dynamic(() => import('../TaskDetail'));

type TTaskCardProps = {
  index: number;
  task: StrapiModel<Task>;
};

const TaskCard = ({ index, task }: TTaskCardProps) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [taskByID, setTaskByID] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const { id, attributes } = task ?? {};
  const {
    title = '',
    level = Level.LOW,
    assignees = { data: [] },
    images = [],
    description = '',
    label = 'todo',
  } = attributes ?? {};

  const handleDelete = useCallback(
    async (id: number) => {
      setIsLoading(true);

      const res = await deleteTask(id);

      setIsLoading(false);

      const { error } = res || {};

      showToast({
        description: error || SUCCESS_MESSAGES.DELETE_TASK,
        status: error ? MESSAGE_STATUS.ERROR : MESSAGE_STATUS.SUCCESS,
      });
    },
    [showToast],
  );

  // TODO:: Handle later
  const handleEdit = () => {};

  const renderImageTask = () => {
    const hasTwoImages = images?.length === 2;

    if (!images) return <></>;

    // If images exist and has exactly two items
    if (hasTwoImages)
      return (
        <div className="flex flex-row justify-between max-w-[235px] gap-[0_12px] xl:gap-[0_21px]">
          {images.map((image, indexImage) => (
            <div
              className="w-[107px] h-[90px] relative"
              key={`imageTask_${indexImage}`}
            >
              <ImageFallback
                fill
                alt={title}
                src={image}
                className="rounded-[10px] object-cover"
              />
            </div>
          ))}
        </div>
      );

    // If images exist and has exactly one item
    return (
      <div className="max-w-[235px] h-[176px] relative">
        <ImageFallback
          alt={title}
          src={images[0]}
          fill
          className="object-cover"
        />
      </div>
    );
  };

  const handleOpenModal = async () => {
    if (id) {
      const task = await getTaskDetails(id);
      setTaskByID(task);
    }

    if (taskByID) {
      setIsShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Draggable draggableId={id.toString()} index={index}>
        {(provided, snapshot) => (
          <>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`w-full bg-white dark:bg-gray-400 p-[20px] rounded-5 shadow-md ${
                snapshot.isDragging ? 'opacity-50' : ''
              }`}
              onClick={handleOpenModal}
            >
              <div className="flex flex-row items-center justify-between mb-[15px]">
                <Text className="text-md" text={title} />
                <DropdownActions
                  id={id}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  isIconOnly
                  disableAnimation
                  customClassName="w-[15px] min-w-[15px]"
                />
              </div>
              <LevelChip level={level} />
              <Text
                className="mt-[20px] text-sm text-justify"
                text={description}
              />

              {images.length !== 0 && (
                <div className="mt-[20px]">{renderImageTask()}</div>
              )}

              <div className="mt-[20px]">
                <AvatarGroup users={assignees.data} />
              </div>
            </div>
            {taskByID && (
              <DynamicTaskDetails
                title={title}
                level={level}
                description={description}
                assignees={assignees}
                renderImages={renderImageTask}
                label={label}
                isOpen={isShowModal}
                onCloseModal={handleCloseModal}
                imageCount={images?.length}
              />
            )}
          </>
        )}
      </Draggable>
    </>
  );
};

export default memo(TaskCard);
