import { CalendarDate, DateValue } from '@nextui-org/react';
import { CalendarDateTime, ZonedDateTime } from '@internationalized/date';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import toObject from 'dayjs/plugin/toObject';

// Types
import {
  StrapiModel,
  Task,
  TEventResponse,
  TProductInvoiceResponse,
} from '@/types';

// Models
import { ICalendarTask, IEvent, IProduct, TInvoiceProduct } from '@/models';

// Constants
import { REGEX } from '@/constants';

dayjs.extend(utc);
dayjs.extend(toObject);

export const formatPrice = (price: number, isDigits: boolean = false) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice) || !numPrice) return '';

  return numPrice?.toLocaleString(
    isDigits ? 'de-DE' : 'en-US',
    isDigits ? { minimumFractionDigits: 2 } : undefined,
  );
};

export const formatTotalAmount = (
  price: number,
  quantity: number,
  isDigits: boolean = false,
) => {
  if (isDigits) return formatPrice(price * quantity, true);

  return formatPrice(price * quantity);
};

export const InsertSkeletonRow = (quantity: number) =>
  Array.from({ length: quantity }, (_, i) => ({ id: i + 1 }));

export const formattedResponseData = <T>(data: StrapiModel<T>[]) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map((item) => {
    const { id, attributes } = item;

    return {
      id,
      ...attributes,
    };
  });
};

export const formatPhoneNumber = (value: string) => {
  const phone = value.replace(/[()\\-]/g, ' ');

  if (phone) return `+${phone}`;

  return '';
};

export const clearPhoneNumberFormat = (value: string): string =>
  value.replace(REGEX.NOT_NUMBER, '').substring(0, 10);

export const formatPhoneNumberTyping: (value: string) => string = (
  value: string,
): string => {
  if (!value) return value;
  const clearedValue = clearPhoneNumberFormat(value);

  const phoneNumberLength = clearedValue.length;

  if (phoneNumberLength < 4) return clearedValue;
  if (phoneNumberLength < 7)
    return `(${clearedValue.slice(0, 3)}) ${clearedValue.slice(3)}`;

  return `(${clearedValue.slice(0, 3)}) ${clearedValue.slice(3, 6)}-${clearedValue.slice(6)}`;
};

/**
 *
 * @param products - the products from api
 * @returns - Calc the price of all products in the table
 *
 */
export const formatSubtotal = (
  items: { data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>[] },
  discount: number = 0,
) => {
  const subtotal = items.data.reduce(
    (prevResult, item) =>
      prevResult + item.attributes.price * item.attributes.quantity,
    0,
  );
  const subtotalWithDiscount = subtotal * (discount / 100);

  if (discount) return `${formatPrice(subtotalWithDiscount, true)} USD`;

  return `${formatPrice(subtotal, true)} USD`;
};

export const formatAmountWithDiscount = (
  items: { data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>[] },
  discount: number = 0,
) => {
  const subtotal = items.data.reduce(
    (prevResult, item) =>
      prevResult + item.attributes.price * item.attributes.quantity,
    0,
  );
  const subtotalWithDiscount = subtotal * (discount / 100);
  const total = subtotal - subtotalWithDiscount;

  return `${formatPrice(total, true)} USD`;
};

export const formatDateString = (date: DateValue) =>
  `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

export const formatDatePicker = (
  date: CalendarDate | CalendarDateTime | ZonedDateTime,
) => {
  // Pad the month and day with a leading zero if they are single digits
  const formattedMonth = String(date.month).padStart(2, '0');
  const formattedDay = String(date.day).padStart(2, '0');
  const formattedYear = String(date.year);

  return `${formattedYear}-${formattedMonth}-${formattedDay}`;
};

export const formatPriceTyping = (value: string) => {
  // Check for an empty or undefined value, set to default '0' if so
  if (value === '') {
    return '';
  }
  // Remove all non-numeric characters except the dot
  const numericValue = value.replace(/[^0-9.]/g, '');

  // Format the numeric value with commas for thousands
  const parts = numericValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Join back the integer and decimal parts
  return `$${parts.join('.')}`;
};

/**
 * Aggregates product quantities by product ID.
 * @param {TProductInvoiceResponse[]} products - Array of products with attributes.
 * @returns {TProductInvoiceResponse[]} - Aggregated product quantities.
 */
export const aggregateProductQuantities = (
  products: TProductInvoiceResponse[],
): TProductInvoiceResponse[] => {
  const quantityByProductId: { [key: string]: TProductInvoiceResponse } = {};

  products.forEach((product) => {
    const productId = product.attributes.product.data.id;
    const quantity = product.attributes.quantity;

    // Check if the product ID exists in the results
    if (!quantityByProductId[productId]) {
      // If not, initialize the object for that ID
      quantityByProductId[productId] = {
        id: productId,
        attributes: {
          ...product.attributes,
          quantity: 0, // Initialize quantity
          product: { data: product.attributes.product.data }, // Keep product info
        },
      };
    }

    // Accumulate the quantity
    quantityByProductId[productId].attributes.quantity += quantity;
  });

  // Convert the object into an array and return
  return Object.values(quantityByProductId);
};

export const getSubarray = <T>(
  data: T[],
  startNumber: number,
  endNumber: number,
) => {
  if (!data) return [];

  return data.slice(startNumber, endNumber);
};

export const capitalizeFirstLetter = (value: string = '') => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatTimeCalendar = (value: string) => {
  const object = dayjs(value).toObject();

  const {
    years = 2014,
    months = 10,
    date = 15,
    hours = 18,
    minutes = 39,
    milliseconds = 15,
  } = object ?? {};

  return new Date(years, months, date, hours - 7, minutes, milliseconds);
};

export const formattedEvents = (events: StrapiModel<IEvent>[]) =>
  events.map(({ id, attributes }) => {
    const { startTime = '', endTime = '' } = attributes ?? {};

    const start = formatTimeCalendar(startTime);
    const end = formatTimeCalendar(endTime);

    return {
      ...attributes,
      id,
      date: dayjs(attributes.date).utc(true).toDate(),
      start,
      end,
    };
  }) as unknown as (Event & IEvent & ICalendarTask)[]; // TODO: Update type later

export const formattedTasks = (events: StrapiModel<ICalendarTask>[]) =>
  events.map(({ id, attributes }) => {
    const { time = '' } = attributes ?? {};

    const start = formatTimeCalendar(time);
    const end = formatTimeCalendar(time);

    return {
      ...attributes,
      id,
      date: dayjs(attributes.date).utc(true).toDate(),
      start,
      end,
    };
  }) as unknown as (Event & IEvent & ICalendarTask)[]; // TODO: Update type later

export const parseStringToNumberArray = (value: string): number[] => {
  return value
    .split(',')
    .filter((item) => item !== '') // Remove empty strings
    .map((item) => Number(item)); // Convert to numbers
};

/**
 * @returns {string} The formatted ISO string (e.g., "2024-10-21T03:00:00Z").
 */
export const formatDateToISO = (dateString: Date, timeString: string) => {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  // Extract the hours and minutes from the timeString
  const [hours, minutes] = timeString.split(':').map(Number);

  // Set the time to the specified hours and minutes in local time
  date.setHours(hours, minutes, 0, 0); // Set hours, minutes, seconds, milliseconds

  // Adjust for the local timezone to UTC
  const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  // Return the ISO string format
  return utcDate.toISOString();
};

export const formattedGuestInfo = (guests: TEventResponse) =>
  guests.users_permissions_users.data.map(({ id, attributes }) => ({
    id,
    name: attributes.fullName,
    avatar: attributes.avatar,
  }));

export const getUserIds = (eventResponse: TEventResponse): string =>
  eventResponse.users_permissions_users.data.map((user) => user.id).join(',');

export const getTimeFromISO = (isoString: string): string => {
  // Check if the provided string is a valid ISO date
  const date = new Date(isoString);

  // If the date is invalid, return an empty string or handle the error
  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO date string');
  }

  // Extract hours and minutes
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Determine AM/PM suffix
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Convert to 12-hour format
  hours = hours % 12 || 12; // Adjust 0 hours to 12 for midnight

  // Format hours and minutes with leading zero if needed
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Return the time in 12-hour format with am/pm
  return `${formattedHours}:${formattedMinutes}${ampm}`;
};

export const getUserIdsForTask = (taskResponse: Task): string => {
  const result = {
    ...taskResponse,
    assignees: taskResponse.assignees.data
      .map((assignee) => assignee.id)
      .join(','),
  };

  return result.assignees;
};

export const filterDataByIndex = <T>(data: T[], indexItem: number) =>
  data?.filter((_, index: number) => index !== indexItem);
