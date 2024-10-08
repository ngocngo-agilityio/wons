'use client';

import { Skeleton } from '@nextui-org/react';

export const MAPPING_RECENT_SERVICES_SKELETON = [
  {
    header: 'Order ID',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Service Name',
    accessor: () => (
      <div className="flex gap-2 items-center">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-3/5 rounded-lg" />
      </div>
    ),
    isSort: true,
  },
  {
    header: 'Price',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Total Order',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Total Amount',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
  },
];

export const MAPPING_PRODUCT_SKELETON = [
  {
    header: 'SN',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Name',
    accessor: () => (
      <div className="flex gap-2 items-center">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-3/5 rounded-lg" />
      </div>
    ),
    isSort: true,
  },
  {
    header: 'Price',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Total Order',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Total Sale',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
  },
  {
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
  },
];

export const MAPPING_INVOICE_LIST_SKELETON = [
  {
    accessor: () => <Skeleton className="h-8 w-2/5 rounded-lg" />,
  },
  {
    header: 'Invoice Id',
    accessor: () => <Skeleton className="h-8 w-4/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Name',
    accessor: () => (
      <div className="flex gap-3.5 items-center min-w-36">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-8 w-3/5 rounded-lg" />
      </div>
    ),
    isSort: true,
  },
  {
    header: 'Email',
    accessor: () => <Skeleton className="h-8 w-4/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Date ',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Status',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
  },
  {
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
  },
  {
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
  },
];

export const MAPPING_CUSTOMER_LIST_SKELETON = [
  {
    header: 'Name',
    accessor: () => (
      <div className="flex gap-3.5 items-center min-w-36">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-8 w-3/5 rounded-lg" />
      </div>
    ),
    isSort: true,
  },
  {
    header: 'Email',
    accessor: () => <Skeleton className="h-8 w-4/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Phone Number ',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    header: 'Gender',
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
    isSort: true,
  },
  {
    accessor: () => <Skeleton className="h-8 w-3/5 rounded-lg" />,
  },
];

export const MAPPING_PRODUCT_DESCRIPTIONS_SKELETON = [
  {
    header: 'PRODUCT DESCRIPTION',
    accessor: () => <Skeleton className="h-2 w-3/5 rounded-5" />,
  },
  {
    header: 'QUANTITY',
    accessor: () => <Skeleton className="h-2 w-3/5 rounded-5" />,
  },
  {
    header: 'RATE',
    accessor: () => <Skeleton className="h-2 w-3/5 rounded-5" />,
  },
  {
    header: 'AMOUNT',
    accessor: () => <Skeleton className="h-2 w-3/5 rounded-5" />,
  },
];
