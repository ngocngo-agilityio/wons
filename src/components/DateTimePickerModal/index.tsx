import { memo } from 'react';

import { Modal as NextModal, ModalContent } from '@nextui-org/react';
import dayjs from 'dayjs';

// Components
import { Input } from '@/components';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

interface DateTimePickerModalProps {
  isOpen: boolean;
  selectedDate: string;
  selectedTime: string;
  onClose: () => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const DateTimePickerModal = ({
  isOpen,
  selectedDate,
  selectedTime,
  onClose,
  onDateChange,
  onTimeChange,
}: DateTimePickerModalProps) => (
  <NextModal isOpen={isOpen} onClose={onClose} closeButton>
    <ModalContent className="p-6">
      <div className="mb-4 flex gap-4">
        <Input
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />

        <Input
          label="Time"
          type="time"
          value={dayjs(selectedTime, 'hh:mma').utc(true).format('HH:mm')}
          onChange={(e) => {
            const selectedTime = e.target.value; // get the time value from input
            const formattedTime = dayjs(selectedTime, 'HH:mm')
              .utc(true)
              .format('hh:mma'); // Convert to 12h format
            onTimeChange(formattedTime); // Call the handler with the new formatted value
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

export default memo(DateTimePickerModal);
