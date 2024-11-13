// Libs
import type { Meta, StoryObj } from '@storybook/react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { fn } from '@storybook/test';

// components
import { TaskCard } from '@/components';

// Mocks
import { MOCK_TASKS } from '@/mocks';

const { todo, inProgress } = MOCK_TASKS;

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  argTypes: {},
  decorators: [
    (Story) => (
      <DragDropContext onDragEnd={fn}>
        <Droppable droppableId={''}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-w-[275px] flex justify-center"
            >
              <Story />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {
  args: {
    task: todo[0],
  },
};

export const CardWithNoImage: Story = {
  args: {
    task: inProgress[0],
  },
};
