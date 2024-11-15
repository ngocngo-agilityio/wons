'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';
import { Chip } from '@nextui-org/react';

// Utils
import { formatPrice, formatTotalAmount } from '@/utils';

// Types
import { StrapiModel } from '@/types';

// Models
import { TInvoiceProduct, IProduct } from '@/models';

// Constants
import { ORDER, SEARCH_QUERIES } from '@/constants';

// Components
import { ImageFallback, Table, Text } from '@/components';

interface IRecentServicesTable {
  data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>[];
  order?: string;
}

const RecentServicesTable = ({ data, order = '' }: IRecentServicesTable) => {
  const { ASC, DESC } = ORDER;

  const searchParams = useSearchParams();

  const pathname = usePathname();
  const { replace } = useRouter();
  const paramsObject = searchParams
    ? Object.fromEntries(searchParams.entries())
    : {};

  const mappingContentColumns = useMemo(
    () => [
      {
        header: 'Order ID',
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => <Text size="sm" text={`#${data.id}`} />,
        isSort: true,
        value: 'id',
      },
      {
        header: 'Service Name',
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => {
          const product = data.attributes.product || {};
          const attributesProduct = product.data.attributes || {};

          const { imageUrl = '', title = '' } = attributesProduct;

          return (
            <div className="flex gap-2 items-center h-[40px]">
              <ImageFallback
                width={40}
                height={40}
                src={imageUrl}
                alt="ui-ux-design"
                sizes="40px"
                className="rounded-5 h-full object-cover"
              />
              <Text size="sm" text={title} />
            </div>
          );
        },
        isSort: true,
        value: 'title',
      },
      {
        header: 'Price',
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => <Text size="sm" text={`$${formatPrice(data.attributes.price)}`} />,
        isSort: true,
        value: 'price',
      },
      {
        header: 'Total Order',
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => (
          <Chip
            classNames={{
              base: [
                'w-[61px] max-w-[61px] h-7.5 max-h-7.5 rounded-[8px]',
                'bg-blue-500/20 dark:bg-purple-600/20',
              ],
              content: ['text-center text-sm', 'text-blue-500 dark:text-white'],
            }}
          >
            {data.attributes.quantity}
          </Chip>
        ),
        isSort: true,
        value: 'quantity',
      },
      {
        header: (
          <Text text="Total Amount" className="text-right block w-full" />
        ),
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => (
          <Text
            className="text-right"
            size="sm"
            text={`$${formatTotalAmount(data.attributes.price, data.attributes.quantity)}`}
          />
        ),
      },
    ],
    [],
  );

  const handleSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);

      if (value) {
        params.set(SEARCH_QUERIES.SORT_BY, value);
        params.set(SEARCH_QUERIES.ORDER, order === DESC ? ASC : DESC);
      }

      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [order, pathname, replace, searchParams],
  );

  return (
    <Table
      isStriped
      variant="secondary"
      columns={mappingContentColumns}
      data={data}
      order={order}
      sortBy={paramsObject.sortBy}
      onSort={handleSort}
    />
  );
};

export default memo(RecentServicesTable);
