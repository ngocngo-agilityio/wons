'use client';

import { useCallback } from 'react';
import {
  extendVariants,
  Pagination as NextUIPagination,
  PaginationProps as NextUIPaginationProps,
} from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Constants
import { DEFAULT_PAGE, SEARCH_QUERIES } from '@/constants';

export const CustomPagination = extendVariants(NextUIPagination, {
  variants: {
    color: {
      primary: {
        item: 'text-foreground hover:bg-primary hover:bg-opacity-25',
        wrapper: 'text-black dark:text-white',
        cursor: `bg-blue-500`,
      },
    },
  },

  defaultVariants: {
    color: 'primary',
  },
});

const Pagination = ({ ...props }: NextUIPaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const { PAGE } = SEARCH_QUERIES;

  const currentPage = searchParams?.get(PAGE) || DEFAULT_PAGE;

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams);

      params.set(PAGE, page.toString());

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, replace, searchParams],
  );

  return (
    <CustomPagination
      showControls
      page={+currentPage}
      onChange={handlePageChange}
      className="flex justify-center m-0"
      {...props}
    />
  );
};

export default Pagination;
