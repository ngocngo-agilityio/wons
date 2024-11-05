import { memo } from 'react';

// Libs
import { Chip } from '@nextui-org/react';

// Types
import { TSize, Level } from '@/types';

type TLevelCardProps = {
  level: Level;
  size?: TSize;
};

const LevelChip = ({ level, size = 'md' }: TLevelCardProps): JSX.Element => {
  const chipClasses = {
    high: {
      bg: 'bg-gray-550 dark:bg-gray-200',
      color: 'text-white dark:text-gray-600',
    },
    medium: {
      bg: 'bg-blue-500 dark:bg-blue-200',
      color: 'text-white dark:text-gray-600',
    },
    low: {
      bg: 'bg-pink-850 dark:bg-pink-500',
      color: 'text-white dark:text-gray-600',
    },
  };

  const defaultChipSize = 'px-[22px] h-[30px] max-h-[30px] rounded-[22px]';

  const chipSize: Partial<Record<TSize, string | undefined>> = {
    md: defaultChipSize,
    sm: 'px-2 rounded-[20px]',
  };

  const chipClass = chipSize[size] ?? defaultChipSize;

  return (
    <Chip
      classNames={{
        base: [`${chipClass}`, `${chipClasses[level]?.bg}`],
        content: [
          'text-center text-md capitalize',
          `${chipClasses[level]?.color}`,
        ],
      }}
    >
      {level}
    </Chip>
  );
};

export default memo(LevelChip);
