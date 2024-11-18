'use client';
import { memo, useEffect, useState } from 'react';
import { Calendar, CalendarProps, DateValue } from '@nextui-org/react';
import { getLocalTimeZone, today } from '@internationalized/date';

// Components
import { Text } from '@/components';

interface CalendarCustomProps extends CalendarProps {
  onDateSelect: (value: DateValue) => void;
}

const CalendarCustom = ({
  value = today(getLocalTimeZone()),
  onDateSelect,
  ...props
}: CalendarCustomProps) => {
  const { month, year } = today(getLocalTimeZone());
  // Initialize selected date, current month, and current year
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(value);
  const [currentMonth, setCurrentMonth] = useState<number>(
    value ? value.month : month, // Check for null here
  );
  const [currentYear, setCurrentYear] = useState<number>(
    value ? value.year : year, // Check for null here
  );

  useEffect(() => {
    // Update internal state whenever the `value` prop changes
    if (value) {
      setSelectedDate(value);
      setCurrentMonth(value.month);
      setCurrentYear(value.year);
    }
  }, [value]);

  const handleDateChange = (date: DateValue) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleFocusChange = (date: DateValue | null) => {
    if (date) {
      const { month, year } = date;
      setCurrentMonth(month);
      setCurrentYear(year);
    }
  };

  // Function to handle month navigation
  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const isCurrentMonth = currentMonth === month && currentYear === year;

  const displayDate = new Date(
    currentYear,
    currentMonth - 1,
    selectedDate?.day ?? 1,
  );

  const formattedDisplayDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(displayDate);

  return (
    <Calendar
      aria-label="Calendar"
      value={selectedDate}
      onChange={handleDateChange}
      onFocusChange={handleFocusChange}
      prevButtonProps={{
        className: 'absolute right-10',
        onClick: () => {
          const newMonth = currentMonth === 1 ? 12 : currentMonth - 1;
          const newYear = currentMonth === 1 ? currentYear - 1 : currentYear;
          handleMonthChange(newMonth, newYear);
        },
      }}
      nextButtonProps={{
        className: 'dark:text-white',
        onClick: () => {
          const newMonth = currentMonth === 12 ? 1 : currentMonth + 1;
          const newYear = currentMonth === 12 ? currentYear + 1 : currentYear;
          handleMonthChange(newMonth, newYear);
        },
      }}
      classNames={{
        base: `dark:bg-gray-400 bg-white border border-white solid overflow-hidden ${
          isCurrentMonth ? 'current-month' : 'other-month'
        }`,
        headerWrapper: 'dark:bg-gray-400',
        title: 'text-white dark:text-white/80 z-[-1]',
        gridBody: 'bg-white dark:bg-gray-400',
        cellButton: `
        data-[selected=true]:bg-blue-500
        dark:data-[selected=true]:bg-purple-600
        dark:data-[selected=true]:text-black
        data-[today=true]:bg-purple-500
        data-[today=true]:hover:bg-purple-600
        dark:data-[today=true]:hover:bg-purple-500
        data-[hover=true]:bg-gray-950
        data-[hover=true]:text-black
        dark:data-[hover=true]:text-white
       `,
        gridHeader: 'dark:bg-gray-400',
        header: 'z-[-1]',
        gridHeaderCell:
          'text-blue-800 dark:text-white/80 font-normal dark:bg-gray-400',
        cell: 'text-[12.64px] leading-[16.46px]',
      }}
      topContent={
        <div className="flex absolute w-4/5 justify-between top-[17px] right-[24px] z-100 bg-white dark:bg-gray-400">
          <Text text={formattedDisplayDate} className="z-100" />
        </div>
      }
      {...props}
    />
  );
};

export default memo(CalendarCustom);
