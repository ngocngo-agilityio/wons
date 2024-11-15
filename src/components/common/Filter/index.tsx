'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import isEqual from 'react-fast-compare';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Listbox,
  ListboxItem,
  ButtonProps,
  PopoverProps,
  PopoverTriggerProps,
  ListboxProps,
  ListboxItemProps,
  PopoverContentProps,
  Selection,
} from '@nextui-org/react';

// Types
import { IFilter } from '@/types';

// Icons
import { FilterIcon } from '../icons';

// Utils
import { formatOptionsSelection } from '@/utils';

// Constants
import { SEARCH_QUERIES } from '@/constants';

// Components
import { Text } from '@/components/common';

interface IFilterProps {
  items: IFilter[];
  title?: string;
  buttonProps?: ButtonProps;
  popoverProps?: PopoverProps;
  popoverTriggerProps?: PopoverTriggerProps;
  popoverContentProps?: PopoverContentProps;
  listboxProps?: ListboxProps;
  listboxItemProps?: ListboxItemProps;
  className?: string;
}

const Filter = ({
  items = [],
  title = '',
  buttonProps,
  popoverProps,
  popoverTriggerProps,
  popoverContentProps,
  listboxProps,
  listboxItemProps,
  className = '',
}: IFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [values, setValues] = useState<Selection>(new Set([]));

  const { FILTERS } = SEARCH_QUERIES;

  const handleSelect = useCallback(
    (keys: Selection) => {
      setValues(keys);
      const params = new URLSearchParams(searchParams);
      const value = formatOptionsSelection(keys);

      if (value) {
        params.set(FILTERS, value);
      } else {
        params.delete(FILTERS);
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, replace, pathname, FILTERS],
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    if (isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, handleScroll]);

  return (
    <Popover
      {...popoverProps}
      className={className}
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger {...popoverTriggerProps}>
        {title && (
          <Button
            className=" w-full bg-blue-500 border-transparent dark:bg-purple-600 text-white px-5 py-3 text-md rounded-[10px] border-[1px] h-auto min-w-max font-medium z-auto"
            endContent={<FilterIcon />}
            {...buttonProps}
          >
            {title}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-3" {...popoverContentProps}>
        {items.map(({ id, title, items }) => (
          <div className="w-full" key={id}>
            <Text
              text={title}
              className="m-[8px_14px_0] font-medium border-b-1 border-blue-800/50 pb-2"
            />
            <Listbox
              className="pt-2"
              selectionMode="multiple"
              selectedKeys={values}
              onSelectionChange={handleSelect}
              {...listboxProps}
            >
              {items.map(({ id, content = '', customElement }) => (
                <ListboxItem
                  key={id}
                  className="px-0 p-[8px_10px]"
                  {...listboxItemProps}
                >
                  {customElement || content}
                </ListboxItem>
              ))}
            </Listbox>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default memo(Filter, isEqual);
