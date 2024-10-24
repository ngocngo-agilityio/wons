import { memo } from 'react';

import { Modal as NextModal, ModalContent } from '@nextui-org/react';
import dayjs from 'dayjs';

// Components
import { Input } from '@/components';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DAYJS_PATTERN } from '@/constants';
dayjs.extend(customParseFormat);

interface DateTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const DateTimeRangePickerModal = ({
  isOpen,
  onClose,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
}: DateTimePickerModalProps) => (
  <NextModal isOpen={isOpen} onClose={onClose} closeButton>
    <ModalContent className="p-6">
      <div className="mb-4">
        <Input
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="time"
          value={dayjs(selectedStartTime, DAYJS_PATTERN['hh:mma'])
            .utc(true)
            .format(DAYJS_PATTERN['HH:mm'])}
          onChange={(e) => {
            const selectedTime = e.target.value; // get the time value from input
            const formattedTime = dayjs(selectedTime, DAYJS_PATTERN['HH:mm'])
              .utc(true)
              .format(DAYJS_PATTERN['hh:mma']); // Convert to 12h format
            onStartTimeChange(formattedTime); // Call the handler with the new formatted value
          }}
        />
        <Input
          label="End Time"
          type="time"
          value={dayjs(selectedEndTime, DAYJS_PATTERN['hh:mma'])
            .utc(true)
            .format(DAYJS_PATTERN['HH:mm'])}
          onChange={(e) => {
            const selectedTime = e.target.value; // get the time value from input
            const formattedTime = dayjs(selectedTime, DAYJS_PATTERN['HH:mm'])
              .utc(true)
              .format(DAYJS_PATTERN['hh:mma']); // Convert to 12h format
            onEndTimeChange(formattedTime); // Call the handler with the new formatted value
          }}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Confirm
        </button>
      </div>
    </ModalContent>
  </NextModal>
);

export default memo(DateTimeRangePickerModal);
