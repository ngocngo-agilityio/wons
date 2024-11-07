'use client';

// Libs
import { memo, useCallback } from 'react';

// Types
import { TToast } from '@/types';

// Constants
import { MESSAGES } from '@/constants';

// Components
import { Button, IoIosClose } from '@/components';

type TToastProps = TToast & {
  onClose: (id: string) => void;
};

const Toast = ({
  id,
  title,
  description,
  status = MESSAGES.STATUS.SUCCESS,
  onClose,
}: TToastProps): JSX.Element => {
  const handleClose = useCallback(() => onClose(id), [id, onClose]);

  const statusColor =
    status === MESSAGES.STATUS.ERROR
      ? 'bg-red-600 dark:bg-red-600'
      : 'bg-green-700 dark:bg-green-700';

  return (
    <div
      className={`min-w-[250px] base:max-w-[340px] lg:max-w-full shadow-lg rounded-lg p-2 lg:mb-2 flex justify-between items-start text-white ${statusColor}`}
    >
      <div className="flex flex-col">
        <h4 className="font-bold capitalize">{title}</h4>
        <p>{description}</p>
      </div>

      <Button
        data-testid="toast-close-button"
        isIconOnly
        className={`ml-2 p-0 hover:bg-transparent dark:hover:bg-transparent text-white ${statusColor}`}
        onClick={handleClose}
      >
        <IoIosClose
          className={`w-6 h-6 outline-0 text-white dark:text-blue ${statusColor}`}
        />
      </Button>
    </div>
  );
};

export default memo(Toast);
