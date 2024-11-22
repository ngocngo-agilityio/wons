'use client';

import React, { useState, useCallback, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getLocalTimeZone } from '@internationalized/date';
import {
  DateRangePicker as DateRangePickerBase,
  DateRangePickerProps,
  DateValue,
  RangeValue,
} from '@nextui-org/react';

// Constants
import {
  DAYJS_PATTERN,
  DEFAULT_RANGE_VALUE_PICKER,
  SEARCH_QUERIES,
} from '@/constants';

// Hooks
import useClickOutside from '@/hooks/useClickOutside';

// Utils
import {
  currentDate,
  formatDate,
  formatDateByISO,
  getStartTimeDatePicker,
} from '@/utils';

// Types
import { DateRangeState } from '@/types';

// Icons
import { FaChevronDown } from 'react-icons/fa6';

// Components
import { Text, Button } from '@/components';

interface DateRangePickerBaseProps extends DateRangePickerProps {}

const DateRangePicker = ({
  minValue,
  maxValue,
  ...rest
}: DateRangePickerBaseProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const paramsObject = searchParams
    ? Object.fromEntries(searchParams.entries())
    : {};
  const [dateRange, setDateRange] = useState<DateRangeState | null>(
    getStartTimeDatePicker(
      DEFAULT_RANGE_VALUE_PICKER - 1,
      paramsObject.startTime,
      paramsObject.endTime,
    ),
  );
  const [isOpenRangePicker, setIsOpenRangePicker] = useState(false);
  const { END_TIME, START_TIME } = SEARCH_QUERIES;

  const modalRef = useRef<HTMLDivElement>(null);

  const handleOpenDatePicker = useCallback(
    () => setIsOpenRangePicker((prev) => !prev),
    [setIsOpenRangePicker],
  );

  // Custom hook to detect click outside the modal
  useClickOutside(modalRef, () => setIsOpenRangePicker(false));

  const handleOnChangeDateRangePicker = useCallback(
    (value: RangeValue<DateValue>) => {
      const params = new URLSearchParams(searchParams);
      const {
        day: startDay = 1,
        month: startMonth = 1,
        year: startYear = 2024,
      } = value.start ?? {};
      const {
        day: endDay = 2,
        month: endMonth = 1,
        year: endYear = 2024,
      } = value.end ?? {};

      setIsOpenRangePicker(false);
      setDateRange(value);

      const startTime = `${startYear}-${startMonth}-${startDay}`;
      const endTime = `${endYear}-${endMonth}-${endDay} 16:59:59`;

      if (startTime && endTime) {
        params.set(START_TIME, formatDateByISO(startTime));
        params.set(END_TIME, formatDateByISO(endTime));
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [END_TIME, START_TIME, pathname, replace, searchParams],
  );

  return (
    <div className="w-full md:max-w-[290.5px] relative bg-gray-50 dark:bg-gray-600 mt-8 md:mt-0">
      <div className="flex justify-between md:gap-[15.85px]">
        {dateRange &&
          Object.keys(dateRange).map((key) => (
            <Button
              key={key}
              className="flex max-w-36 w-36 relative bg-white cursor-pointer dark:bg-gray-400 rounded-[5.28px] h-[42.25px] items-center px-0 justify-start gap-6"
              onClick={handleOpenDatePicker}
              endContent={
                <div className="flex items-center justify-center w-[15px] h-[15px]  rounded-full hover:bg-gray-100">
                  <FaChevronDown className="w-[8.43px] h-[8.43px]" />
                </div>
              }
            >
              <Text
                text={formatDate(
                  dateRange?.[key as keyof typeof dateRange].toDate(
                    getLocalTimeZone(),
                  ),
                  DAYJS_PATTERN['DD-MM-YYYY'],
                )}
                className="text-[15.02px] ml-[17.96px]"
              />
            </Button>
          ))}
      </div>
      <div className="absolute z-[-1] w-full top-0">
        <DateRangePickerBase
          classNames={{
            innerWrapper: 'z-[-1]',
            inputWrapper: 'shadow-none',
          }}
          ref={modalRef}
          className="h-[42.25px]"
          isOpen={isOpenRangePicker}
          value={dateRange}
          label="Date Range Picker"
          minValue={minValue}
          maxValue={maxValue ?? currentDate}
          onChange={handleOnChangeDateRangePicker}
          {...rest}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
