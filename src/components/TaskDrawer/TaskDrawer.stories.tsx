import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// Libraries
import { SessionProvider } from 'next-auth/react';
import Drawer from 'react-modern-drawer';

// Hooks
import { useBreakPoints } from '@/hooks';

// Components
import TaskDrawer from './index';
import { Button, BsPlus } from '../common';
import TaskForm from '../TaskForm';

const meta: Meta<typeof TaskDrawer> = {
  title: 'Components/TaskDrawer',
  component: TaskDrawer,
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <SessionProvider>
        <div className="w-full h-[1000px] flex justify-center">
          <Story />
        </div>
      </SessionProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskDrawer>;

const BasicUsage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isGreaterThanMd } = useBreakPoints();

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <Button
        startContent={<BsPlus size={22} className="text-white" />}
        color="primary"
        className="base:w-full md:w-[122px] h-10 base:gap-2 md:gap-0.5"
        onClick={handleOpenDrawer}
      >
        Add New Task
      </Button>

      {isDrawerOpen && (
        <Drawer
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
          direction="right"
          size={isGreaterThanMd ? 450 : 375}
        >
          <div className="p-8 bg-white dark:bg-gray-400 h-full max-w-full overflow-y-auto">
            <TaskForm
              onAvatarChange={fn()}
              onCloseDrawer={handleCloseDrawer}
              key={isDrawerOpen ? 'open' : 'closed'}
              onSubmit={fn()}
              setReset={fn()}
            />
          </div>
        </Drawer>
      )}
    </>
  );
};

export const Default: Story = {
  render: () => <BasicUsage />,
};
