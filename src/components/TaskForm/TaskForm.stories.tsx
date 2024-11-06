import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

// Components
import TaskForm from './index';

const meta: Meta<typeof TaskForm> = {
  title: 'Components/TaskForm',
  component: TaskForm,
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <div className="w-[350px] h-[1000px] flex justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskForm>;

export const Default: Story = {
  args: {
    isDisabledField: false,
    onSubmit: fn(),
    setReset: fn(),
    previewData: null,
    onCloseDrawer: fn(),
    onAvatarChange: fn(),
  },
};
