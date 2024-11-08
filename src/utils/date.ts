import { DateLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date';
import { DateValue } from '@nextui-org/react';

// Types
import { DateRangeState } from '@/types';

// Constants
import { DAYJS_PATTERN } from '@/constants';

dayjs.extend(utc);

/***
 * Function format date
 */
export const formatDate = (date: string | Date, pattern: string) =>
  dayjs(date).utc(true).format(pattern);

/**
 * Function get start time for DatePicker
 */
export const getStartTimeDatePicker = (
  date: number,
  startTime: string,
  endTime: string,
): DateRangeState => {
  // Get the current date in the local timezone
  const currentDate = today(getLocalTimeZone());
  const defaultStartTime = currentDate.add({
    days: -date,
  });
  const defaultStartTimeIso = `${defaultStartTime.year}-${String(
    defaultStartTime.month,
  ).padStart(2, '0')}-${String(defaultStartTime.day).padStart(2, '0')}`;

  return {
    start: parseDate(
      startTime
        ? formatDate(new Date(startTime), DAYJS_PATTERN['YYYY-MM-DD'])
        : defaultStartTimeIso,
    ),

    end: endTime
      ? parseDate(formatDate(new Date(endTime), DAYJS_PATTERN['YYYY-MM-DD']))
      : currentDate,
  };
};

/**
 * Function Get current date
 */
export const currentDate = today(getLocalTimeZone());

export const formatDateByISO = (date: string): string =>
  dayjs(date).utc(true).format();

export const convertToCalendarDate = (
  date?: string,
): CalendarDate | undefined => {
  if (!date) {
    return undefined;
  }

  const [year, month, day] = date.split('-');

  return new CalendarDate(Number(year), Number(month), Number(day));
};

// Function to convert the custom date object to a JavaScript Date object
const convertToDate = (calendarDate: DateValue) => {
  const { day, month, year } = calendarDate;

  // JavaScript Date's month is 0-indexed, so subtract 1 from month
  return new Date(year, month - 1, day);
};

// Function to format the date as "Month Day, Year"
export const formatDateCalendar = (calendarDate: DateValue) => {
  const date = convertToDate(calendarDate);

  // Using JavaScript's Intl.DateTimeFormat API to format the date
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatToCalendarDate = (value: Date) => {
  // Convert to UTC and format to 'YYYY-MM-DD'
  const utcDate = dayjs(value).utc(true).format(DAYJS_PATTERN['YYYY-MM-DD']);

  // Parse the UTC date string
  return parseDate(utcDate);
};

/**
 * Converts a CalendarDate object to a JavaScript Date object.
 * @param value - A CalendarDate object with year, month, and day properties
 * @returns A JavaScript Date object
 */
export const formatToStandardDate = (value: CalendarDate) => {
  return new Date(value.year, value.month - 1, value.day);
};

/**
 * Formats a JavaScript Date object to a readable string format including the day of the week, month, and date as "Day.Month Date" format.
 * @param date - A JavaScript Date object
 * @returns A formatted string like "Monday. January 1"
 */
export const formatEventDate = (date: Date) => {
  // Get date as letter
  const selectedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
  });

  // Get month as letter
  const selectedMonth = date.toLocaleDateString('en-US', {
    month: 'long',
  });

  const selectedDateNumber = date.getDate();

  // Get the year
  const selectedYear = date.getFullYear();

  return `${selectedDate}, ${selectedMonth} ${selectedDateNumber}, ${selectedYear}`;
};

export const formatTo12HourTime = (selectedTime: string) =>
  dayjs(selectedTime, DAYJS_PATTERN['HH:mm'])
    .utc(true)
    .format(DAYJS_PATTERN['hh:mma']);

export const getDayOfWeek = (
  date: Date,
  culture: string | undefined,
  localizer: DateLocalizer | undefined,
): string => {
  return localizer
    ? localizer.format(date, 'ddd', culture ?? '')
    : dayjs(date).format('ddd');
};

export const getDayOfMonth = (
  date: Date,
  culture: string | undefined,
  localizer: DateLocalizer | undefined,
): string => {
  return localizer
    ? localizer.format(date, 'DD', culture ?? '')
    : dayjs(date).format('DD');
};

export const covertDateToISO = (date: string): string => {
  if (!date) return '';

  return dayjs(date).utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
};
