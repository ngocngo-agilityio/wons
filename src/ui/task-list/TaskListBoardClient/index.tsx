'use client';

import { memo, useEffect, useState, useTransition } from 'react';
import isEqual from 'react-fast-compare';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

// Utils
import { convertTasksByStatus, mapTaskStatusToStateKey } from '@/utils';

// Constants
import { MESSAGE_STATUS, MESSAGES } from '@/constants';

// Components
import { Column, Text } from '@/components';

// hooks
import { useToast } from '@/hooks';

// Actions
import { updateTask } from '@/actions';

// Types
import { StrapiModel, Task, TasksState, TaskStatus } from '@/types';

interface ITaskListBoardProps {
  data: StrapiModel<Task>[];
}

const TaskListBoardClient = ({ data }: ITaskListBoardProps) => {
  const [tasks, setTasks] = useState<TasksState>(convertTasksByStatus(data));
  const [_, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    const { droppableId, index } = source;

    const taskByID: StrapiModel<Task> = data.find(
      ({ id }) => id === Number(draggableId),
    ) as StrapiModel<Task>;

    if (!destination) return;

    const destinationColumn = mapTaskStatusToStateKey(
      destination.droppableId as TaskStatus,
    );

    const sourceColumn = mapTaskStatusToStateKey(droppableId as TaskStatus);

    const sourceTasks = Array.from(tasks[sourceColumn]);
    const destinationTasks = Array.from(tasks[destinationColumn]);

    const [movedTask] = sourceTasks.splice(index, 1);

    if (droppableId !== destination.droppableId) {
      destinationTasks.splice(destination.index, 0, movedTask);
    } else {
      sourceTasks.splice(destination.index, 0, movedTask);
    }

    setTasks({
      ...tasks,
      [sourceColumn]: sourceTasks,
      [destinationColumn]: destinationTasks,
    });

    startTransition(async () => {
      const { error } = await updateTask(Number(draggableId), {
        ...taskByID.attributes,
        label: destinationColumn,
      });
      const { ERROR, SUCCESS } = MESSAGE_STATUS;

      showToast({
        description: error ?? MESSAGES.SUCCESS.UPDATE_TASK,
        status: error ? ERROR : SUCCESS,
      });
    });
  };

  useEffect(() => {
    setTasks(convertTasksByStatus(data));
  }, [data]);

  const hasTasks = Object.values(tasks).some(
    (columnTasks) => columnTasks.length > 0,
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="relative flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full h-full base:mt-10 md:mt-6">
        <Column status={TaskStatus.Todo} tasks={tasks.todo} />
        <Column status={TaskStatus.InProgress} tasks={tasks.inProgress} />
        <Column status={TaskStatus.InReview} tasks={tasks.inReview} />
        <Column status={TaskStatus.Done} tasks={tasks.done} />

        {!hasTasks && (
          <div className="absolute top-20 left-0 right-0 flex justify-center items-center z-10">
            <Text className="text-center" size="xl" text="No Tasks Found" />
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default memo(TaskListBoardClient, isEqual);
