'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useDisclosure } from '@nextui-org/react';
import {
  Calendar as CalendarBase,
  CalendarProps,
  dayjsLocalizer,
  SlotInfo,
  Views,
} from 'react-big-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './index.css';

// Models
import { IEvent, TUser } from '@/models';

// Constants
import { MESSAGE_STATUS, ROUTES, SUCCESS_MESSAGES } from '@/constants';

// Utils
import { formattedEvents, formattedGuestInfo, getTimeFromISO } from '@/utils';

// Types
import { TEventResponse } from '@/types';

// Components
import {
  Button,
  ConfirmModal,
  CustomCalendar,
  EventDetail,
  EventFormModal,
  LoadingIndicator,
} from '@/components';
import CustomToolBar from '../CustomToolBar';

// actions
import { deleteEvent } from '@/actions';

// hooks
import { useToast } from '@/hooks';

const localizer = dayjsLocalizer(dayjs);

type ViewType = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

interface CalendarClientProps extends Omit<CalendarProps, 'localizer'> {
  events: (Event & IEvent)[];
  isAdmin: boolean;
  user: TUser;
  createEvent: (data: Partial<IEvent>) => void;
}

interface Slot {
  start: Date;
  end: Date;
}

const CalendarClient = ({
  user,
  events,
  isAdmin,
  createEvent,
  ...rest
}: CalendarClientProps) => {
  const [view, setView] = useState<ViewType>(Views.MONTH);
  const { isOpen: isOpenEventFormModal, onOpenChange: onToggleEventFormModal } =
    useDisclosure();

  const [slot, setSlot] = useState<Slot | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<TEventResponse | null>(
    null,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const formattedEventData = formattedEvents(
    events.map((event) => ({ id: event.id, attributes: event })),
  );

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      if (dayjs(slotInfo.start).isBefore(dayjs(), 'day')) {
        return;
      }

      setSlot({
        start: slotInfo.start,
        end: slotInfo.end,
      });

      // Open the Add event form modal
      onToggleEventFormModal();
    },
    [onToggleEventFormModal],
  );

  const handleSelectEvent = (event: unknown) => {
    const selectedEvent = event as TEventResponse;

    setSelectedEvent(selectedEvent);

    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: Partial<IEvent>) => {
    onToggleEventFormModal();
    createEvent(data);
  };

  const handleDeleteEvent = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteEvent = useCallback(async () => {
    if (selectedEvent && selectedEvent.id !== undefined) {
      setIsLoading(true);
      const response = await deleteEvent(selectedEvent.id);
      setIsLoading(false);
      const { error } = response || {};
      showToast({
        description: error || SUCCESS_MESSAGES.DELETE_EVENT,
        status: error ? MESSAGE_STATUS.ERROR : MESSAGE_STATUS.SUCCESS,
      });

      if (!error) {
        setSelectedEvent(null);
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
      }
    } else {
      setIsConfirmModalOpen(false);
    }
  }, [selectedEvent, showToast]);

  return (
    <div className="flex h-[calc(100vh-120px)] gap-[37px] relative">
      <div className="hidden md:flex bg-white dark:bg-gray-400 px-[18px] md:px-[28px] py-3 md:py-[32px] rounded-[5px] md:flex-col justify-between">
        <CustomCalendar />
        <Button color="secondary" as={Link} href={ROUTES.SCHEDULE}>
          My Schedule
        </Button>
      </div>
      <div className="flex-1">
        <CalendarBase
          {...rest}
          defaultView={Views.MONTH}
          onView={setView}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          view={view}
          events={formattedEventData}
          components={{ toolbar: CustomToolBar }}
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={isAdmin ? handleSelectSlot : undefined}
          onSelectEvent={handleSelectEvent}
        />
      </div>

      {selectedEvent && (
        <div className="event-detail-container">
          {isLoading && <LoadingIndicator />}
          <EventDetail
            title={selectedEvent.title}
            time={`${dayjs(selectedEvent.date).format('YYYY-MM-DD')} ${getTimeFromISO(selectedEvent.startTime)} - ${getTimeFromISO(selectedEvent.endTime)}`}
            location={selectedEvent.location || 'No location specified'}
            isOpen={isModalOpen}
            onCloseModal={handleCloseModal}
            guests={formattedGuestInfo(selectedEvent)}
            id={selectedEvent.id}
            onDelete={isAdmin ? handleDeleteEvent : undefined}
          />
        </div>
      )}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Delete Events"
        content="Are you sure you want to delete this events?"
        onConfirm={confirmDeleteEvent}
      />

      {isOpenEventFormModal && (
        <EventFormModal
          user={user}
          title="Create Event"
          eventTitle=""
          date={slot?.start || new Date()}
          timeRange={{
            start: dayjs(slot?.start).format('HH:mm'),
            end: dayjs(slot?.end).add(2, 'hour').format('HH:mm'),
          }}
          isOpen={isOpenEventFormModal}
          onSubmit={handleFormSubmit}
          onClose={onToggleEventFormModal}
          status="free"
          visibility="default"
          notificationTime={0}
        />
      )}
    </div>
  );
};

export default CalendarClient;
