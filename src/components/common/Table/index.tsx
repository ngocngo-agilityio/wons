'use client';

import { Key, memo, ReactNode, useCallback } from 'react';
import { clsx } from 'clsx';
import isEqual from 'react-fast-compare';
import {
  Table as BaseTable,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  Selection,
} from '@nextui-org/react';

// Icons
import { IoCaretDown } from 'react-icons/io5';

// Types
import { TableColumnType, TTableAccessor } from '@/types';

// Constants
import { ORDER } from '@/constants';

type VariantTable = 'primary' | 'secondary' | 'tertiary';

interface CustomTableProps<T> {
  columns: TableColumnType<T>[];
  data: T[];
  variant?: VariantTable;
  isStriped?: boolean;
  isStripedRow?: boolean;
  selectionMode?: 'single' | 'multiple' | 'none';
  onSelectionChange?: (keys: string) => void;
  sortBy?: string;
  order?: string;
  onSort?: (value: string) => void;
  onSelectChange?: (keys: Selection) => void;
  onRowAction?: (key: Key) => void;
}

const TableCustom = <T extends { id: string }>({
  columns,
  data,
  variant = 'primary',
  isStriped = false,
  isStripedRow = false,
  selectionMode = 'none',
  order = ORDER.ASC,
  sortBy = '',
  onSort,
  onSelectChange = () => {},
  onRowAction,
}: CustomTableProps<T>) => {
  const renderCell = (item: T, accessor?: TTableAccessor<T>): ReactNode => {
    if (!accessor) return;

    if (typeof accessor === 'string')
      return <span>{item[accessor] as ReactNode}</span>;

    if (typeof accessor === 'function') return accessor(item);
  };

  const TableClasses = {
    primary: {
      header: 'bg-gray-50 dark:bg-gray-600 px-[17px]',
      table:
        'border-separate border-spacing-x-0 border-spacing-y-[10px] bg-gray-50 dark:bg-gray-600',
      td: 'last:rounded-r-lg last:group-data-[middle=true]:before:rounded-r-lg',
      cell: 'text-[10px] sm:text-[14px] leading-[18px] py-[17px] px-[17px]',
    },
    secondary: {
      header:
        'bg-white dark:bg-gray-400 border-b-[1px] border-blue-800/5 dark:border-white/5 px-[21px]',
      table:
        'px-0 dark:[&>tbody>*:nth-child(odd)]:bg-gray-400 [&>tbody>*:nth-child(even)]:bg-gray-50/50 dark:[&>tbody>*:nth-child(even)]:bg-gray-600',
      td: 'last:rounded-r-lg',
      cell: 'leading-[17px] py-[17px] px-[21px]',
    },
    tertiary: {
      header:
        'bg-white dark:bg-gray-400 border-b-[1px] border-blue-800/5 dark:border-white/5 px-0',
      table:
        'px-0 dark:[&>tbody>*:nth-child(odd)]:bg-gray-400 [&>tbody>*:nth-child(even)]:bg-gray-50/50 dark:[&>tbody>*:nth-child(even)]:bg-gray-600',
      td: 'last:rounded-r-lg px-0',
      cell: 'leading-[17px] py-[17px]',
    },
  };

  const handleSelectChange = useCallback(
    (keys: Selection) => onSelectChange(keys),
    [onSelectChange],
  );

  return (
    <BaseTable
      {...(isStriped && { isStriped: true })}
      selectionMode={selectionMode}
      aria-label="Table"
      checkboxesProps={{
        classNames: {
          wrapper: [
            'after:bg-blue-500 dark:after:bg-purple-600',
            'after:hover:bg-blue-500 dark:after:hover:bg-purple-600',
            'before:border-blue-800/30 dark:before:border-white/30',
            'rounded-sm',
            'before:rounded-sm',
            'after:rounded-sm',
            'w-5 h-5',
            'mx-4',
            'before:border',
          ],
          icon: 'text-white dark:text-gray-400',
        },
      }}
      classNames={{
        base: 'grid',
        wrapper: clsx(
          'p-0 shadow-none dark:bg-gray-400',
          isStripedRow && 'rounded-none',
        ),
        table: TableClasses[variant].table,
        td: clsx(
          'first:rounded-l-lg first:group-data-[middle=true]:before:rounded-l-lg',
          TableClasses[variant].td,
          TableClasses[variant].cell,
        ),
        th: [
          clsx(
            'first:rounded-l-none last:rounded-r-none',
            TableClasses[variant].header,
          ),
        ],
      }}
      onSelectionChange={handleSelectChange}
      onRowAction={onRowAction}
    >
      <TableHeader className="border-spacing-y-0">
        {columns.map((columnConfig, index) => {
          const {
            value = '',
            header,
            isSort = false,
            isCustomStyle = false,
          } = columnConfig;

          const handleSort = () => {
            onSort?.(value as string);
          };

          return (
            <TableColumn
              key={`${value}${index}`}
              data-testid="sort-btn"
              className={clsx(
                'py-0 cursor-pointer font-normal',
                TableClasses[variant].header,
                isStripedRow && 'border-none',
              )}
              onClick={handleSort}
              aria-hidden={!header ? 'true' : 'false'}
            >
              <div
                className={clsx(
                  'flex items-center gap-2',
                  isCustomStyle && 'justify-end',
                )}
              >
                {header}
                {isSort && (
                  <IoCaretDown
                    className={clsx(
                      value === sortBy && order === ORDER.DESC && 'rotate-180',
                    )}
                  />
                )}
              </div>
            </TableColumn>
          );
        })}
      </TableHeader>
      <TableBody emptyContent="No Records found.">
        {data.map((item) => (
          <TableRow
            key={item.id}
            data-id={item.id}
            className={clsx(
              isStripedRow &&
                'border-b-1 border-gray-50 dark:border-gray-50/50 dark:bg-gray-400',
              isStriped ? 'rounded-[5px]' : 'bg-white dark:bg-gray-400',
            )}
          >
            {columns.map((columnConfig, indexColumn) => (
              <TableCell
                key={`${columnConfig.value}-table-cell-${indexColumn}`}
                className={TableClasses[variant].cell}
              >
                {renderCell(item, columnConfig.accessor)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </BaseTable>
  );
};

export const Table = memo(TableCustom, isEqual) as <T>(
  props: CustomTableProps<T>,
) => JSX.Element;
