'use client';

import { memo, useState } from 'react';
import { Modal as NextModal, ModalContent, Input } from '@nextui-org/react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Components
import { Button, Text } from '@/components';

// Constants
import { DAYJS_PATTERN, MESSAGES } from '@/constants';

// Utils
import { formatTo12HourTime } from '@/utils';

dayjs.extend(customParseFormat);

interface DateTimePickerModalProps {
  isOpen: boolean;
  selectedDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
  onClose: () => void;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const DateTimeRangePickerModal = ({
  isOpen,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onClose,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: DateTimePickerModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value;

    const formattedTime = formatTo12HourTime(selectedTime);

    setErrorMessage(
      dayjs(formattedTime, 'hh:mma').isAfter(dayjs(selectedEndTime, 'hh:mma'))
        ? MESSAGES.ERROR.START_TIME
        : '',
    );

    onStartTimeChange(formattedTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value;

    const formattedTime = formatTo12HourTime(selectedTime);

    setErrorMessage(
      dayjs(selectedStartTime, 'hh:mma').isAfter(dayjs(formattedTime, 'hh:mma'))
        ? MESSAGES.ERROR.END_TIME
        : '',
    );

    onEndTimeChange(formattedTime);
  };

  return (
    <NextModal isOpen={isOpen} onClose={onClose} closeButton>
      <ModalContent className="p-6">
        <div className="mb-4">
          <Input
            labelPlacement="outside"
            placeholder=" "
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            labelPlacement="outside"
            placeholder=" "
            label="Start Time"
            type="time"
            value={dayjs(selectedStartTime, DAYJS_PATTERN['hh:mma'])
              .utc(true)
              .format(DAYJS_PATTERN['HH:mm'])}
            onChange={handleStartTimeChange}
          />
          <Input
            label="End Time"
            labelPlacement="outside"
            placeholder=" "
            type="time"
            value={dayjs(selectedEndTime, DAYJS_PATTERN['hh:mma'])
              .utc(true)
              .format(DAYJS_PATTERN['HH:mm'])}
            onChange={handleEndTimeChange}
          />
        </div>
        <div className="min-h-8 mt-2">
          {errorMessage && (
            <Text
              text={errorMessage}
              className="text-red-500 dark:text-red-500 text-md"
            />
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={onClose}
            color="primary"
            isDisabled={!!errorMessage}
            className="px-4 py-2 bg-blue-500 rounded-md"
          >
            Confirm
          </Button>
        </div>
      </ModalContent>
    </NextModal>
  );
};

export default memo(DateTimeRangePickerModal);
