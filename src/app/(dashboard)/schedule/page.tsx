import { Metadata } from 'next';
import { Suspense } from 'react';

// Mocks
import { TASK_TABS } from '@/mocks';

// Constants
import { IMAGES, PAGE_TITLES } from '@/constants';

// Layouts
import { DashBoardLayout } from '@/layouts';

// Tabs
import { Tabs, SkeletonTaskListBoard } from '@/components';

// ui
import { ScheduleListFilter, TaskListBoard, ScheduleListActions } from '@/ui';

// Types
import { ISearchParams } from '@/types';

export const metadata: Metadata = {
  title: 'Wons Schedule',
  description:
    'Manage pending, ongoing, and completed tasks. And save the details of that project.',
  openGraph: {
    title: 'Wons Schedule',
    description:
      'Manage pending, ongoing, and completed tasks. And save the details of that project.',
    images: [
      {
        url: IMAGES.PREVIEW_IMAGE,
        alt: 'preview image',
      },
    ],
  },
};

interface ISchedulePage {
  searchParams: ISearchParams;
}

const SchedulePage = async ({ searchParams }: ISchedulePage) => (
  <main>
    <DashBoardLayout
      title={PAGE_TITLES.TASK_PREVIEW}
      rightContent={<ScheduleListFilter />}
    >
      <div className="md:flex md:justify-between md:items-center">
        <Tabs
          defaultSelectedKey={TASK_TABS[1].key}
          disabledKeys={[TASK_TABS[0].key, TASK_TABS[2].key]}
          tabs={TASK_TABS}
          customVariant="secondary"
          className="p-0 base:w-full md:w-fit"
          classNames={{
            tabList: 'base:w-full md:w-fit',
          }}
        />

        <ScheduleListActions />
      </div>

      <Suspense fallback={<SkeletonTaskListBoard />}>
        <TaskListBoard searchParams={searchParams} />
      </Suspense>
    </DashBoardLayout>
  </main>
);

export default SchedulePage;
