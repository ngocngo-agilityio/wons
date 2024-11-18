import { memo, ReactNode } from 'react';
import clsx from 'clsx';

// Components
import { Heading } from '@/components';

interface IDashboardLayout {
  children: ReactNode;
  title?: string;
  rightContent?: ReactNode;
}

const DashboardLayout = ({
  title = '',
  children,
  rightContent,
}: IDashboardLayout) => (
  <>
    <section
      className={clsx(
        'base:mb-10 md:mb-7.5',
        'w-full md:flex md:justify-between md:items-center',
      )}
    >
      {title && (
        <Heading className="w-full base:mb-8 md:mb-0" title={title} as="h1" />
      )}
      {rightContent}
    </section>
    {children}
  </>
);

export default memo(DashboardLayout);
