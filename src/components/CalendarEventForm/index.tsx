'use client';

import { memo, useState, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import isEqual from 'react-fast-compare';
import dayjs from 'dayjs';
import { zodResolver } from '@hookform/resolvers/zod';

import { Select, SelectItem } from '@nextui-org/react';

// Constants
import { MESSAGES } from '@/constants';

// Types
import { TEventResponse } from '@/types';

// Utils
import {
  capitalizeFirstLetter,
  clearErrorOnChange,
  eventSchema,
  formatDateString,
  formatDateToISO,
  formatEventDate,
  formatToCalendarDate,
  formatToStandardDate,
  getDirtyState,
  getUserIds,
  isEnableSubmitButton,
  parseStringToNumberArray,
} from '@/utils';

// Api
import { getUsers } from '@/api'; // Import API to fetch users

// Models
import { IEvent, TUser } from '@/models';

// Components
import {
  ClockIcon,
  CalendarIcon,
  LocationIcon,
  PeopleIcon,
  Input,
  Button,
  Text,
  AddressInput,
  DateTimeRangePickerModal,
} from '@/components';

interface TimeRangeProps {
  start: string;
  end: string;
}

interface EventForm {
  title: string;
  location?: string;
  people?: string | number[];
}

interface CalendarEventFormProps {
  previewData?: EventForm | null;
  timeRange?: TimeRangeProps;
  eventTitle: string;
  date: Date;
  user?: TUser;
  repeatSetting?: string;
  onSubmit: (data: Partial<IEvent>) => void;
  onClose: () => void;
}

const REQUIRED_FIELDS = ['title'];

const CalendarEventForm = ({
  previewData,
  timeRange,
  eventTitle,
  date,
  user,
  repeatSetting = 'does not repeat',
  onClose,
  onSubmit,
}: CalendarEventFormProps) => {
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [users, setUsers] = useState<TUser[]>([]); // State to store user list
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(formatToCalendarDate(date));
  const [startTime, setStartTime] = useState(timeRange?.start);
  const [endTime, setEndTime] = useState(timeRange?.end);
  const [isOpenLocation, setIsOpenLocation] = useState(false);

  const {
    handleSubmit,
    control,
    clearErrors,
    watch,
    formState: { errors, dirtyFields, defaultValues },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: previewData
      ? {
          title: previewData?.title || '',
          location: previewData?.location,
          people: getUserIds(previewData as TEventResponse) || '',
        }
      : {
          title: eventTitle,
          location: '',
          people: '',
        },
  });

  const standardDate = formatToStandardDate(calendarDate);
  const formattedDate = formatEventDate(standardDate);

  const toggleDateTimePicker = useCallback(() => {
    setIsDateTimePickerOpen((prev) => !prev);
  }, [setIsDateTimePickerOpen]);

  const handleFormSubmit = handleSubmit((data) => {
    const people = parseStringToNumberArray(data.people as string);

    const formattedStart = formatDateToISO(
      new Date(formatDateString(calendarDate)),
      dayjs(startTime, 'hh:mma').utc(true).format('HH:mm'),
    );
    const formattedEnd = formatDateToISO(
      new Date(formatDateString(calendarDate)),
      dayjs(endTime, 'hh:mma').utc(true).format('HH:mm'),
    );

    onSubmit({
      ...data,
      users_permissions_users: [Number(user?.id), ...people],
      startTime: formattedStart,
      endTime: formattedEnd,
      date: new Date(formatDateString(calendarDate)),
    });
  });

  const handleModalClose = () => {
    onClose();
  };

  const toggleUserList = useCallback(async () => {
    const response = await getUsers(); // Call API to fetch users

    if (response) {
      setUsers(response);
    }
  }, []);

  useEffect(() => {
    toggleUserList(); // Automatically fetch users when component mounts
  }, [toggleUserList]);

  const usersOptions = users
    .filter((u) => u.id.toString() !== user?.id.toString())
    .map((user) => ({
      label: user.username,
      key: user.id,
    }));

  // Checking to disable/enable submit button
  const dirtyItems = Object.keys(dirtyFields);

  const enableSubmit: boolean = useMemo(
    () => isEnableSubmitButton(REQUIRED_FIELDS, dirtyItems, errors),
    [dirtyItems, errors],
  );
  const requiredField = REQUIRED_FIELDS.filter((field) => field !== 'imageUrl');

  const allFieldsFilled = requiredField.every((field) => {
    const isDirty = dirtyItems.includes(field);
    const hasError = errors[field as keyof Partial<EventForm>];
    return isDirty && !hasError;
  });

  const isDisableSubmit = previewData
    ? !(
        enableSubmit ||
        !getDirtyState(defaultValues ?? {}, watch()) ||
        !isEqual(timeRange?.start, startTime) ||
        !isEqual(timeRange?.end, endTime) ||
        !isEqual(formatToCalendarDate(date), calendarDate)
      )
    : !allFieldsFilled;

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <Controller
          name="title"
          control={control}
          rules={{
            required: MESSAGES.ERROR.FIELD_REQUIRED,
          }}
          render={({
            field: { name, onChange, ...rest },
            fieldState: { error },
          }) => (
            <Input
              classNames={{
                inputWrapper: 'w-full h-[42px] rounded-[10px] bg-gray-200/30',
                input:
                  'placeholder:text-blue-800 placeholder:opacity-20 placeholder:font-medium placeholder:text-[16px]',
              }}
              type="text"
              isInvalid={!!error}
              placeholder="Add title"
              errorMessage={error?.message}
              onChange={(e) => {
                onChange(e.target.value);
                clearErrorOnChange(name, errors, clearErrors);
              }}
              {...rest}
            />
          )}
        />

        <div className="flex mt-[25px] gap-[0_15px]">
          <Button
            isIconOnly
            className="bg-pink-50 dark:bg-pink-600 text-pink-500 dark:text-pink-500 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer px-0"
            data-testid="time-button"
            onClick={toggleDateTimePicker}
          >
            <ClockIcon />
          </Button>

          <div>
            <div className="flex gap-1">
              <Text
                as="time"
                className="text-blue-800 text-[12px] font-normal leading-normal col-span-1"
                text={`${formattedDate}`} // Display date
              />
              <Text as="span" text="-" />
              <Text
                as="time"
                className="text-blue-800 text-[12px] font-normal leading-normal col-span-1 uppercase"
                text={`${startTime} - ${endTime}`} // Display time
              />
            </div>

            <Text
              className="text-[rgba(1, 13, 28, 0.50)] text-opacity-50 text-[12px] font-normal leading-normal col-span-2"
              text={`Time zone - ${capitalizeFirstLetter(repeatSetting)}`}
            />
          </div>
        </div>

        {(isUserListOpen || previewData) && (
          <Controller
            name="people"
            control={control}
            render={({ field: { onChange, value, name, ...rest } }) => (
              <Select
                selectionMode="multiple"
                label="Add People"
                defaultSelectedKeys={value}
                placeholder=" "
                labelPlacement="outside"
                variant="flat"
                classNames={{
                  trigger:
                    'w-full bg-gray-50 dark:bg-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-900 focus:bg-gray-50 dark:focus:bg-gray-600 py-[26px] mt-5',
                  label: 'text-xl font-medium pb-1',
                }}
                onChange={(e) => {
                  onChange(e.target.value);
                  clearErrorOnChange(name, errors, clearErrors);
                }}
                {...rest}
              >
                {usersOptions.map(({ key, label }) => (
                  <SelectItem key={key}>{label}</SelectItem>
                ))}
              </Select>
            )}
          />
        )}

        {(isOpenLocation || previewData?.location) && (
          <Controller
            name="location"
            control={control}
            render={({
              field: { name, onChange, ...rest },
              fieldState: { error },
            }) => (
              <AddressInput
                isInvalid={!!error}
                errorMessage={error?.message}
                label="Location"
                classNames={{ mainWrapper: 'mt-5' }}
                onChange={(value) => {
                  onChange(value);

                  // Clear error message on change
                  clearErrorOnChange(name, errors, clearErrors);
                }}
                {...rest}
              />
            )}
          />
        )}

        <div className="flex gap-[0_25px] m-[30px_0]">
          {!isUserListOpen && !previewData && (
            <Button
              color="primary"
              startContent={<PeopleIcon />}
              className="text-[15px] font-medium w-auto  py-[10px] px-[25px] mt-10 mt-0"
              onClick={() => setIsUserListOpen((prev) => !prev)}
            >
              Add People
            </Button>
          )}

          {!isOpenLocation && !previewData?.location && (
            <Button
              startContent={<LocationIcon />}
              className="bg-white font-medium dark:bg-white text-center text-blue-500 dark:text-blue-500 border-[1px] border-[rgba(58, 54, 219, 0.1)] py-[10px] px-[25px] rounded-[10px] font-DM-Sans text-[14.22px] font-normal leading-normal"
              onClick={() => setIsOpenLocation(true)}
            >
              Add Location
            </Button>
          )}
        </div>

        <div className="m-[0_0_40px] flex gap-[0_15px]">
          <Button
            className="bg-pink-50 dark:bg-pink-600 text-pink-500 dark:text-pink-500 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer px-0"
            data-testid="calendar-button"
          >
            <CalendarIcon width={15} height={15} color="pink-500" />
          </Button>

          <div className="flex flex-col gap-[0_30px]">
            <Text
              className="text-blue-800 text-[12px] font-normal leading-normal col-span-1"
              text={user?.fullName || ''} // Display name
            />
            <Text
              className="text-[rgba(1, 13, 28, 0.50)] text-opacity-50 text-[12px] font-normal leading-normal"
              text="Busy - Default visibility - notify 30 minutes before" // Display status
            />
          </div>
        </div>

        <div className="flex flex-row-reverse gap-[0_20px]">
          <Button
            className="min-w-[93px] text-[15px] font-normal w-auto py-[10px] mt-10 mt-0"
            type="submit"
            color="primary"
            isDisabled={isDisableSubmit}
          >
            Save
          </Button>

          <Button
            className="min-w-[93px] bg-white font-normal dark:bg-white text-center text-blue-500 dark:text-blue-500 border-[1px] border-[rgba(58, 54, 219, 0.1)] py-[10px] rounded-[10px] font-DM-Sans text-[15px] font-normal leading-normal"
            onClick={handleModalClose}
          >
            Close
          </Button>
        </div>
      </form>

      {/* DateTimePickerModal */}
      {isDateTimePickerOpen && (
        <DateTimeRangePickerModal
          isOpen={isDateTimePickerOpen}
          onClose={toggleDateTimePicker}
          selectedDate={formatDateString(calendarDate)}
          selectedStartTime={startTime ?? ''}
          selectedEndTime={endTime ?? ''}
          onDateChange={(dateString) =>
            setCalendarDate(formatToCalendarDate(new Date(dateString)))
          }
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />
      )}
    </>
  );
};

export default memo(CalendarEventForm, isEqual);
