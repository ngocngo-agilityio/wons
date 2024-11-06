// Apis
import { getCalendarEvents, getCalendarTasks } from '@/api';

import { formattedEvents, formattedTasks } from '@/utils';

// Actions
import { createEvent, updateEvent } from '@/actions';

// Components
import CalendarClient from './CalendarClient';

const Calendar = async () => {
  const { data: events = [] } = await getCalendarEvents();
  const { data: tasks = [] } = await getCalendarTasks();

  return (
    <CalendarClient
      events={[...formattedEvents(events), ...formattedTasks(tasks)]}
      createEvent={createEvent}
      updateEvent={updateEvent}
    />
  );
};

export default Calendar;
