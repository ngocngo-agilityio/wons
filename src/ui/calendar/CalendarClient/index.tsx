'use client';

import { ComponentType, memo, useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import isEqual from 'react-fast-compare';

// libs
import Link from 'next/link';
import dayjs from 'dayjs';
import { DateValue, useDisclosure } from '@nextui-org/react';
import {
  Calendar as CalendarBase,
  CalendarProps,
  DateLocalizer,
  dayjsLocalizer,
  SlotInfo,
  Views,
} from 'react-big-calendar';
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

// Models
import { ICalendarTask, IEvent } from '@/models';

// Constants
import { MESSAGES, ROUTES } from '@/constants';

// Utils
import {
  formattedGuestInfo,
  getDayOfMonth,
  getDayOfWeek,
  getTimeFromISO,
} from '@/utils';

// Types
import { TEventResponse } from '@/types';

// Hocs
import { withAccountState } from '@/hocs/withAccountState';

// Components
import {
  Button,
  ConfirmModal,
  CustomCalendar,
  EventDetail,
  CalendarModal,
  LoadingIndicator,
} from '@/components';
import CustomToolBar from '../CustomToolBar';

// actions
import {
  createCalenderTask,
  deleteCalendarTask,
  deleteEvent,
  updateCalendarTask,
} from '@/actions';

// hooks
import { useToast } from '@/hooks';

const localizer = dayjsLocalizer(dayjs);

type ViewType = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

interface CalendarClientProps extends Omit<CalendarProps, 'localizer'> {
  events: (Event & IEvent & ICalendarTask)[];
  isAdmin: boolean;
  createEvent: (data: Partial<IEvent>) => Promise<{ error?: string } | void>;
  updateEvent: (
    id: number,
    data: Partial<IEvent>,
  ) => Promise<{ error?: string } | void>;
}

interface Slot {
  start: Date;
  end: Date;
}

const CalendarClient = ({
  events,
  isAdmin,
  createEvent,
  updateEvent,
  ...rest
}: CalendarClientProps) => {
  const [view, setView] = useState<ViewType>(Views.MONTH);
  const { isOpen: isOpenEventFormModal, onOpenChange: onToggleEventFormModal } =
    useDisclosure();
  const [previewData, setPreviewData] = useState<TEventResponse | null>();
  const [slot, setSlot] = useState<Slot | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TEventResponse | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
  const timeZone = getLocalTimeZone();
  const [isTask, setIsTask] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { data: session } = useSession();
  const { user } = session ?? {};

  const onCloseFormModal = () => {
    onToggleEventFormModal();
    setPreviewData(null);
    setIsEdit(false);
    setIsTask(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const {
    SUCCESS: {
      UPDATE_EVENT,
      CREATE_EVENT,
      UPDATE_TASK,
      CREATE_TASK,
      DELETE_TASK,
      DELETE_EVENT,
    },
    STATUS: { ERROR, SUCCESS },
  } = MESSAGES;

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsTask(false);
    setIsEdit(false);
  }, []);

  const handleSelectSlot = useCallback(
    ({ start, end }: SlotInfo) => {
      // Check for duplicate time range (12:00 AM - 12:00 AM) on date click in month view
      const isTimeRangeDuplicate =
        start.getHours() === end.getHours() &&
        start.getMinutes() === end.getMinutes();

      // Add 30 minutes to slotInfo when time range is duplicate
      const adjustedEndTime = isTimeRangeDuplicate
        ? new Date(end.getTime() + 30 * 60 * 1000)
        : end;

      if (dayjs(start).isBefore(dayjs(), 'day')) {
        return;
      }

      setSlot({
        start: start,
        end: adjustedEndTime,
      });

      // Open the Add event form modal
      onToggleEventFormModal();
    },
    [onToggleEventFormModal],
  );

  const handleSelectEvent = (event: unknown) => {
    const selectedEvent = event as TEventResponse;

    if (selectedEvent.time) {
      setIsTask(true);
    }

    setSelectedEvent(selectedEvent);

    setIsModalOpen(true);
  };

  const handleFormSubmitEvent = async (data: Partial<IEvent>) => {
    onToggleEventFormModal();

    if (previewData) {
      if (selectedEvent && selectedEvent.id !== undefined) {
        setIsLoading(true);

        const response = await updateEvent(selectedEvent.id, data);

        setIsLoading(false);

        const { error } = response || {};
        showToast({
          description: error || UPDATE_EVENT,
          status: error ? ERROR : SUCCESS,
        });

        if (!error) {
          setSelectedEvent(null);
          setIsModalOpen(false);
        }
      }
    } else {
      setIsLoading(true);

      const response = await createEvent(data);

      setIsLoading(false);

      const { error } = response || {};
      showToast({
        description: error || CREATE_EVENT,
        status: error ? ERROR : SUCCESS,
      });
    }

    setIsTask(false);
    setIsEdit(false);
  };

  const handleFormSubmitTask = async (data: Partial<IEvent>) => {
    onToggleEventFormModal();

    if (previewData) {
      if (selectedEvent && selectedEvent.id !== undefined) {
        setIsLoading(true);

        const response = await updateCalendarTask(selectedEvent.id, data);

        setIsLoading(false);

        const { error } = response || {};
        showToast({
          description: error || UPDATE_TASK,
          status: error ? ERROR : SUCCESS,
        });

        if (!error) {
          setSelectedEvent(null);
          setIsModalOpen(false);
          setPreviewData(null);
        }
      }
    } else {
      setIsLoading(true);

      const response = await createCalenderTask(data);

      setIsLoading(false);

      const { error } = response || {};
      showToast({
        description: error || CREATE_TASK,
        status: error ? ERROR : SUCCESS,
      });
    }

    setIsTask(false);
    setIsEdit(false);
  };

  const handleDeleteEvent = () => {
    setIsConfirmModalOpen(true);
  };

  const handleDeleteTask = () => {
    setIsConfirmModalOpen(true);
    setIsTask(true);
  };

  const handleEditEvent = async () => {
    setIsModalOpen(false);
    setIsEdit(true);
    setPreviewData(selectedEvent);

    onToggleEventFormModal();
  };

  const handleEditTask = async () => {
    setIsModalOpen(false);
    setPreviewData(selectedEvent);
    setIsEdit(true);
    setIsTask(true);

    onToggleEventFormModal();
  };

  const confirmDeleteEvent = useCallback(async () => {
    if (selectedEvent && selectedEvent.id !== undefined) {
      setIsLoading(true);

      if (!isTask) {
        const response = await deleteEvent(selectedEvent.id);

        setIsLoading(false);
        const { error } = response || {};
        showToast({
          description: error || DELETE_EVENT,
          status: error ? ERROR : SUCCESS,
        });

        if (!error) {
          setPreviewData(null);
          setSelectedEvent(null);
          setIsModalOpen(false);
          setIsConfirmModalOpen(false);
        }
      } else {
        const response = await deleteCalendarTask(selectedEvent.id);

        setIsTask(false);
        setIsLoading(false);
        const { error } = response || {};
        showToast({
          description: error || DELETE_TASK,
          status: error ? ERROR : SUCCESS,
        });

        if (!error) {
          setPreviewData(null);
          setSelectedEvent(null);
          setIsModalOpen(false);
          setIsConfirmModalOpen(false);
        }
      }
    } else {
      setIsConfirmModalOpen(false);
    }
  }, [isTask, selectedEvent, showToast]);

  const handleDateSelect = ({ day, month, year }: DateValue) => {
    const calendarDate = new CalendarDate(year, month, day);

    setSelectedDate(calendarDate);

    setView(Views.DAY);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setIsTask(false);
    setIsEdit(false);
  };

  const handleNavigateCalendar = (newDate: Date) => {
    const updatedDate = new CalendarDate(
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      newDate.getDate(),
    );
    setSelectedDate(updatedDate);
  };

  const dayFormat = (
    date: Date,
    culture: string | undefined,
    localizer: DateLocalizer | undefined,
  ): string => {
    const dayOfWeek = getDayOfWeek(date, culture, localizer);
    const dayOfMonth = getDayOfMonth(date, culture, localizer);

    return `${dayOfWeek}\n${dayOfMonth}`;
  };

  return (
    <div className="flex h-screen md:h-[calc(100vh-120px)]  gap-4 md:gap-6 lg:gap-[37px] xl:gap-10 relative">
      <div className="hidden md:flex bg-white dark:bg-gray-400 px-[18px] md:px-[28px] py-3 md:py-[32px] rounded-[5px] md:flex-col justify-between">
        <CustomCalendar
          key={`${selectedDate.month}+${selectedDate.day}+${selectedDate.year}`}
          onDateSelect={handleDateSelect}
          value={selectedDate}
        />
        <Button color="secondary" as={Link} href={ROUTES.SCHEDULE}>
          My Schedule
        </Button>
      </div>

      <section className="flex-1 overflow-auto">
        <CalendarBase
          {...rest}
          formats={{
            dayFormat,
          }}
          defaultView={Views.MONTH}
          onView={setView}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          view={view}
          events={events}
          components={{ toolbar: CustomToolBar }}
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={isAdmin ? handleSelectSlot : undefined}
          onSelectEvent={handleSelectEvent}
          date={selectedDate.toDate(timeZone)}
          onNavigate={handleNavigateCalendar}
          onDrillDown={(date) => {
            handleNavigateCalendar(date);

            setView(Views.DAY); // Set to the day view after clicking on the header date if needed
          }}
        />
      </section>

      {selectedEvent && (
        <div className="event-detail-container">
          {isLoading && <LoadingIndicator />}
          {selectedEvent.startTime ? (
            <EventDetail
              title={selectedEvent.title}
              time={`${dayjs(selectedEvent.date).format('YYYY-MM-DD')} ${getTimeFromISO(selectedEvent.startTime)} - ${getTimeFromISO(selectedEvent.endTime)}`}
              location={selectedEvent.location || 'No location specified'}
              isOpen={isModalOpen}
              onCloseModal={handleCloseModal}
              guests={formattedGuestInfo(selectedEvent)}
              id={selectedEvent.id}
              onDelete={handleDeleteEvent}
              onEdit={handleEditEvent}
            />
          ) : (
            <EventDetail
              title={selectedEvent?.title || ''}
              time={`${dayjs(selectedEvent?.date).format('YYYY-MM-DD')} ${getTimeFromISO(selectedEvent?.time || '')}`}
              description={selectedEvent?.descriptions}
              isOpen={isModalOpen}
              onCloseModal={handleCloseModal}
              id={selectedEvent?.id || 0}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          )}
        </div>
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onCancel={handleCloseConfirmModal}
        title={isTask ? 'Delete Task' : 'Delete Event'}
        content="Are you sure you want to delete this item?"
        onConfirm={confirmDeleteEvent}
      />

      {isOpenEventFormModal &&
        (!isTask ? (
          <CalendarModal
            user={user}
            title={previewData ? 'Update Event' : 'Create Event'}
            eventTitle=""
            date={
              previewData
                ? new Date(previewData.date)
                : slot?.start || new Date()
            }
            timeRange={{
              start: previewData
                ? dayjs(previewData.startTime).utc().format('hh:mma')
                : dayjs(slot?.start).format('hh:mma'),
              end: previewData
                ? dayjs(previewData.endTime).utc().format('hh:mma')
                : dayjs(slot?.end).format('hh:mma'),
            }}
            time={
              previewData
                ? dayjs(previewData.time).utc().format('hh:mma')
                : dayjs().format('hh:mma')
            }
            previewData={previewData}
            isTask={isTask}
            isEdit={isEdit}
            isOpen={isOpenEventFormModal}
            onSubmit={isTask ? handleFormSubmitTask : handleFormSubmitEvent}
            onClose={onCloseFormModal}
            setIsTask={setIsTask}
          />
        ) : (
          <CalendarModal
            title={previewData ? 'Update Task' : 'Create Task'}
            eventTitle=""
            date={
              previewData
                ? new Date(previewData.date)
                : slot?.start || new Date()
            }
            previewData={previewData}
            time={
              previewData
                ? dayjs(previewData.time).utc().format('hh:mma')
                : dayjs().format('hh:mma')
            }
            timeRange={{
              start: previewData
                ? dayjs(previewData.startTime).utc().format('hh:mma')
                : dayjs(slot?.start).format('hh:mma'),
              end: previewData
                ? dayjs(previewData.endTime).utc().format('hh:mma')
                : dayjs(slot?.end).format('hh:mma'),
            }}
            isTask={isTask}
            isEdit={isEdit}
            isOpen={isOpenEventFormModal}
            onSubmit={handleFormSubmitTask}
            onClose={onCloseFormModal}
          />
        ))}
    </div>
  );
};

export default withAccountState<CalendarClientProps>(
  memo(CalendarClient, isEqual) as ComponentType<CalendarClientProps>,
);
