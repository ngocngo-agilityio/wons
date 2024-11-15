import { memo } from 'react';
import isEqual from 'react-fast-compare';

// Libs
import { Chip } from '@nextui-org/react';

// Types
import { InvoiceStatus } from '@/types';

interface TInvoiceStatusProps {
  variant?: InvoiceStatus;
}

const InvoiceStatusComponent = ({
  variant = InvoiceStatus.Complete,
}: TInvoiceStatusProps): JSX.Element => {
  const chipClasses: Record<InvoiceStatus, { bg: string; color: string }> = {
    [InvoiceStatus.Complete]: {
      bg: 'bg-blue-500/10 dark:bg-purple-600/10',
      color: 'text-blue-500 dark:text-purple-400',
    },
    [InvoiceStatus.Pending]: {
      bg: 'bg-teal-500/10 dark:bg-teal-300/10',
      color: 'text-teal-650 dark:text-teal-300',
    },
    [InvoiceStatus.Cancel]: {
      bg: 'bg-pink-500/10 dark:bg-gray-900',
      color: 'text-pink-800 dark:text-pink-450',
    },
    [InvoiceStatus.Default]: {
      bg: 'bg-gray-500/10',
      color: 'text-gray-500',
    },
  };

  return (
    <Chip
      classNames={{
        base: [
          'w-[162px] max-w-[162px] h-[45px] max-h-[45px] rounded-[22px]',
          `${chipClasses[variant]?.bg}`,
        ],
        content: [
          'text-center text-md capitalize',
          `${chipClasses[variant]?.color}`,
        ],
      }}
    >
      {variant}
    </Chip>
  );
};

export default memo(InvoiceStatusComponent, isEqual);
