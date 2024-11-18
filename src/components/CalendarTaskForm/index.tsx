'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import isEqual from 'react-fast-compare';
import dayjs from 'dayjs';
import { Textarea } from '@nextui-org/react';
import { zodResolver } from '@hookform/resolvers/zod';

// Constants
import { MESSAGES } from '@/constants';

// Models
import { ICalendarTask } from '@/models';

// Utils
import {
  clearErrorOnChange,
  formatDateString,
  formatDateToISO,
  formatEventDate,
  formatToCalendarDate,
  formatToStandardDate,
  getDirtyState,
  isEnableSubmitButton,
  taskSchema,
} from '@/utils';

// Components
import {
  Button,
  ClockIcon,
  DateTimePickerModal,
  Input,
  Text,
} from '@/components';

interface TaskForm {
  title: string;
  descriptions: string;
}

interface CalendarTaskFormProps {
  time: string;
  date: Date;
  previewData?: Partial<ICalendarTask> | null;
  onClose: () => void;
  onSubmit: (data: Partial<ICalendarTask>) => void;
}

const REQUIRED_FIELDS = ['title', 'descriptions'];

const CalendarTaskForm = ({
  previewData,
  time,
  date,
  onClose,
  onSubmit,
}: CalendarTaskFormProps) => {
  const [timeDate, setTimeDate] = useState(time);
  const [calendarDate, setCalendarDate] = useState(formatToCalendarDate(date));
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);

  const {
    handleSubmit,
    control,
    clearErrors,
    watch,
    formState: { errors, defaultValues, dirtyFields },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: previewData || {
      title: '',
      descriptions: '',
    },
  });

  // Checking to disable/enable submit button
  const dirtyItems = Object.keys(dirtyFields);

  const enableSubmit: boolean = useMemo(
    () => isEnableSubmitButton(REQUIRED_FIELDS, dirtyItems, errors),
    [dirtyItems, errors],
  );
  const requiredField = REQUIRED_FIELDS.filter((field) => field !== 'imageUrl');

  const allFieldsFilled = requiredField.every((field) => {
    const isDirty = dirtyItems.includes(field);
    const hasError = errors[field as keyof Partial<TaskForm>];
    return isDirty && !hasError;
  });

  const isDisableSubmit = previewData
    ? !(
        enableSubmit ||
        !getDirtyState(defaultValues ?? {}, watch()) ||
        !isEqual(time, timeDate) ||
        !isEqual(formatToCalendarDate(date), calendarDate)
      )
    : !allFieldsFilled;

  const toggleDateTimePicker = useCallback(() => {
    setIsDateTimePickerOpen((prev) => !prev);
  }, [setIsDateTimePickerOpen]);

  const handleFormSubmit = handleSubmit((data) => {
    const formattedTime = formatDateToISO(
      new Date(formatDateString(calendarDate)),
      dayjs(timeDate, 'hh:mma').utc(true).format('HH:mm'),
    );

    onSubmit({
      ...data,
      time: formattedTime,
      date: new Date(formatDateString(calendarDate)),
    });
  });

  const handleModalClose = () => {
    onClose();
  };

  const standardDate = formatToStandardDate(calendarDate);
  const formattedDate = formatEventDate(standardDate);

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

        <div
          className="flex mt-[25px] gap-[0_15px]"
          onClick={toggleDateTimePicker}
        >
          <Button
            className="bg-pink-50 dark:bg-pink-600 text-pink-500 dark:text-pink-500 border-none rounded-full w-10 h-10 flex justify-center items-center cursor-pointer px-0"
            data-testid="time-button"
            onClick={toggleDateTimePicker}
          >
            <ClockIcon />
          </Button>

          <div>
            <div className="flex gap-1">
              <Text
                className="text-blue-800 text-[12px] font-normal leading-normal col-span-1"
                text={formattedDate} // Display date
              />
              <Text as="span" text="-" />
              <Text
                className="text-blue-800 text-[12px] font-normal leading-normal col-span-1 uppercase"
                text={timeDate} // Display time
              />
            </div>

            <Text
              className="text-[rgba(1, 13, 28, 0.50)] text-opacity-50 text-[12px] font-normal leading-normal col-span-2"
              text="Does not repeat"
            />
          </div>
        </div>

        <div className="flex flex-col pt-8">
          <label className="text-xl font-medium pb-2">Description</label>
          <Controller
            name="descriptions"
            control={control}
            render={({
              field: { name, onChange, ...rest },
              fieldState: { error },
            }) => (
              <Textarea
                classNames={{
                  input: 'text-blue-800/70 dark:text-white/70',
                  inputWrapper: [
                    'bg-gray-50 dark:bg-gray-600',
                    'hover:bg-gray-200/50 dark:hover:bg-gray-900',
                    'focus-within:bg-gray-50 dark:focus-within:bg-gray-600',
                    'group-data-[focus=true]:bg-gray-50 dark:group-data-[focus=true]:bg-gray-600',
                  ],
                }}
                isInvalid={!!error}
                errorMessage={error?.message}
                onChange={(e) => {
                  onChange(e.target.value);
                  clearErrorOnChange(name, errors, clearErrors);
                }}
                {...rest}
              />
            )}
          />
        </div>

        <div className="flex flex-row-reverse gap-[0_20px] mt-6">
          <Button
            className="min-w-[93px] text-[15px] font-normal w-auto py-[10px] mt-0"
            type="submit"
            color="primary"
            isDisabled={isDisableSubmit}
          >
            Save
          </Button>

          <Button
            className="min-w-[93px] bg-white font-normal dark:bg-white text-center text-blue-500 dark:text-white/70 border-[1px] border-[rgba(58, 54, 219, 0.1)] py-[10px] rounded-[10px] font-DM-Sans text-[15px] font-normal leading-normal"
            onClick={handleModalClose}
          >
            Close
          </Button>
        </div>
      </form>

      {/* DateTimePickerModal */}
      {isDateTimePickerOpen && (
        <DateTimePickerModal
          isOpen={isDateTimePickerOpen}
          onClose={toggleDateTimePicker}
          selectedDate={formatDateString(calendarDate)}
          onDateChange={(dateString) =>
            setCalendarDate(formatToCalendarDate(new Date(dateString)))
          }
          selectedTime={timeDate}
          onTimeChange={setTimeDate}
        />
      )}
    </>
  );
};

export default memo(CalendarTaskForm, isEqual);
