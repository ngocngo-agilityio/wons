// components
import { SearchInput, TaskDrawer } from '@/components';

const ScheduleListActions = async (): Promise<JSX.Element> => (
  <div className="flex items-center gap-5 mt-5 md:mt-0 base:flex-col md:flex-row">
    <SearchInput className="base:w-full md:w-fit" />

    <TaskDrawer />
  </div>
);

export default ScheduleListActions;
