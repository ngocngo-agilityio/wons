'use client';

import { memo } from 'react';

// Libraries
import { IoClose } from 'react-icons/io5';
import isEqual from 'react-fast-compare';
import { Modal as NextModal, ModalContent } from '@nextui-org/react';

// Models
import { IEvent, TUser } from '@/models';

// Components
import {
  Heading,
  Button,
  Tabs,
  CalendarEventForm,
  CalendarTaskForm,
} from '@/components';

interface TimeRangeProps {
  start: string;
  end: string;
}

interface EventForm {
  title: string;
  location?: string;
  people?: string | number[];
}

interface TaskForm {
  title: string;
  description: string;
}

interface EventFormModalProps {
  title: string;
  eventTitle: string;
  date: Date;
  timeRange?: TimeRangeProps;
  time?: string;
  isOpen: boolean;
  user?: TUser;
  previewData?: EventForm | TaskForm | null;
  isEdit?: boolean;
  isTask?: boolean;
  setIsTask?: (value: boolean) => void;
  onSubmit: (data: Partial<IEvent>) => void;
  onClose: () => void;
}

const CalendarModal = ({
  title,
  eventTitle,
  date,
  timeRange,
  isEdit = false,
  isTask = false,
  time,
  isOpen,
  user,
  previewData,
  setIsTask,
  onClose,
  onSubmit,
}: EventFormModalProps): JSX.Element => {
  const handleModalClose = () => {
    onClose();
  };

  const handleSelectionChange = (key: React.Key) => {
    if (key === 'task') {
      setIsTask && setIsTask(true);
    }
  };

  const calendarTabs = [
    {
      key: 'event',
      label: 'Event',
      content: (
        <CalendarEventForm
          previewData={previewData}
          timeRange={timeRange}
          eventTitle={eventTitle}
          date={date}
          user={user}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      ),
      isDisable: isEdit && isTask,
    },
    {
      key: 'task',
      label: 'Task',
      content: (
        <CalendarTaskForm
          previewData={previewData}
          date={date}
          onClose={onClose}
          time={time ?? ''}
          onSubmit={onSubmit}
        />
      ),
      isDisable: isEdit && !isTask,
    },
    {
      key: 'reminder',
      label: 'Reminder',
      content: 'This is the reminder content',
      isDisable: true,
    },
  ];

  return (
    <NextModal
      className="max-w-[467px]"
      isOpen={isOpen}
      size="xl"
      hideCloseButton={true}
      placement="center"
    >
      <ModalContent className="relative top-0 left-0 p-[30px_30px_40px] bg-white dark:bg-gray-800 rounded-[10px] shadow-[-14px_30px_20px_0px_rgba(0,0,0,0.05)] w-[467px]">
        <Heading className="mt-[12px]" size="md" title={title} />

        <Button
          className="absolute top-[30px] right-[30px] bg-pink-50 dark:bg-pink-600 text-pink-500 dark:text-pink-500 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer px-0"
          data-testid="close-button"
          onClick={handleModalClose}
        >
          <IoClose size={20} />
        </Button>

        <Tabs
          style={{ padding: 0, margin: '40px 0 18px' }}
          tabs={calendarTabs}
          defaultSelectedKey={isEdit && isTask ? 'task' : 'event'}
          onSelectionChange={handleSelectionChange}
        />
      </ModalContent>
    </NextModal>
  );
};

export default memo(CalendarModal, isEqual);
