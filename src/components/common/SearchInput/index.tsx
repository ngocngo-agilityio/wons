'use client';

import { ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input, InputProps } from '@nextui-org/react';

// Constants
import { SEARCH_QUERIES, DEFAULT_PAGE } from '@/constants';

// Components
import { CiSearch } from '@/components';

const SearchInput = ({ ...props }: InputProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const defaultValueSearch: string = searchParams
    ?.get(SEARCH_QUERIES.QUERY)
    ?.toString() as string;

  const { PAGE, QUERY } = SEARCH_QUERIES;

  const handleSearch = useDebouncedCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value;
      const params = new URLSearchParams(searchParams);

      params.set(PAGE, DEFAULT_PAGE.toString());

      if (term) {
        params.set(QUERY, term);
      } else {
        params.delete(QUERY);
      }

      replace(`${pathname}?${params.toString()}`);
    },
    500,
  );

  return (
    <Input
      classNames={{
        input: [
          'text-blue-800 dark:text-white',
          'placeholder:text-sm placeholder:text-blue-800/50 dark:placeholder:text-white/50',
        ],
        inputWrapper: [
          'bg-white dark:bg-gray-400',
          'hover:bg-white dark:hover:bg-gray-400',
          'focus-within:bg-white dark:focus-within:bg-gray-400',
          'group-data-[focus=true]:bg-white dark:group-data-[focus=true]:bg-gray-400',
          'pl-5 pr-3.5 py-3',
          'md:max-w-[230px]',
        ],
      }}
      placeholder="Search"
      defaultValue={defaultValueSearch}
      onChange={handleSearch}
      endContent={
        <CiSearch className="w-3 h-3 text-blue-800/60 dark:text-white/60 cursor-pointer" />
      }
      {...props}
    />
  );
};

export default SearchInput;
