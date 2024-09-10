import { memo, ReactNode } from 'react';

// Constants
import { TABLE_TITLES } from '@/constants';

// components
import { Heading } from '@/components';

interface ITableLayout {
  children: ReactNode;
  title?: string;
  rightContent?: ReactNode;
  className?: string;
}

const TableLayout = ({
  children,
  title = TABLE_TITLES.RECENT_ORDERS,
  rightContent,
  className = '',
}: ITableLayout) => {
  return (
    <section
      className={`bg-white dark:bg-gray-400 base:p-6 md:p-7 rounded-10 ${className}`}
    >
      <div className="flex justify-between mb-2">
        <Heading
          title={title}
          size="sm"
          className="text-blue-800/70 dark:text-white/70"
        />
        {rightContent}
      </div>
      {children}
    </section>
  );
};

export default memo(TableLayout);
