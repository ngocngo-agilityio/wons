'use client';

// Libs
import { Key, memo, useCallback, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import Link from 'next/link';
import { Selection } from '@nextui-org/react';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

// Types
import { TInvoiceDataResponse, InvoiceStatus } from '@/types';

// Hocs
import { withAccountState } from '@/hocs/withAccountState';

// Constants
import { DAYJS_PATTERN } from '@/constants';

// Components
import {
  InvoiceStatus as InvoiceStatusComponent,
  CalendarIcon,
  EmailIcon,
  ImageFallback,
  Table,
  Text,
  DropdownActions,
  MdDelete,
  Button,
  StarButton,
} from '@/components';

const Pagination = dynamic(() => import('@/components/common/Pagination'));
const ConfirmModal = dynamic(() => import('@/components/common/ConfirmModal'));

interface TInvoicesTableProps {
  data: TInvoiceDataResponse[];
  pageCount: number;
  sortBy?: string;
  order?: string;
  isAdmin: boolean;
  onEdit: (id: number) => void;
  onDelete: (invoiceId: number, invoiceProductIds: number[]) => void;
  onDeleteMultiple: (ids: number[], invoiceProductIds: number[]) => void;
  onToggleSelectStar: (id: number, isSelected: boolean) => void;
  onSort: (field: string) => void;
  onRowAction: (key: Key) => void;
}

const InvoicesTable = ({
  data = [],
  pageCount,
  sortBy = '',
  order = '',
  isAdmin,
  onEdit,
  onDelete,
  onDeleteMultiple,
  onToggleSelectStar,
  onSort,
  onRowAction,
}: TInvoicesTableProps): JSX.Element => {
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = useCallback(
    (invoiceId: number) => {
      const deletedInvoice = data.find((invoice) => {
        const { id } = invoice || {};

        return invoiceId === id;
      });

      const { attributes } = deletedInvoice || {};
      const { invoice_products: invoiceProducts } = attributes || {};
      const { data: invoiceProductsData = [] } = invoiceProducts || {};

      const invoiceProductIds = invoiceProductsData.map((item) => {
        const { id } = item || {};

        return id;
      });

      onDelete(invoiceId, invoiceProductIds);
    },
    [data, onDelete],
  );

  const handleOpenConfirmModal = useCallback(() => setIsModalOpen(true), []);

  const handleConfirmDeleteMultiple = useCallback(() => {
    const deletedInvoiceProductIds: number[] = [];

    selectedInvoiceIds.forEach((invoiceId) => {
      const deletedInvoice = data.find((invoice) => {
        const { id } = invoice || {};

        return invoiceId === id;
      });

      const { attributes } = deletedInvoice || {};
      const { invoice_products: invoiceProducts } = attributes || {};
      const { data: invoiceProductsData = [] } = invoiceProducts || {};

      const invoiceProductIds = invoiceProductsData.map((item) => {
        const { id } = item || {};

        return id;
      });

      deletedInvoiceProductIds.push(...invoiceProductIds);
    });

    onDeleteMultiple(selectedInvoiceIds, deletedInvoiceProductIds);
    setIsModalOpen(false);
  }, [data, onDeleteMultiple, selectedInvoiceIds]);

  const handleCancelDeleteMultiple = () => {
    setIsModalOpen(false);
  };

  const mappingContentColumns = useMemo(
    () =>
      [
        {
          header: 'Invoice Id',
          accessor: (invoiceData: TInvoiceDataResponse) => {
            const { attributes } = invoiceData || {};

            const { invoiceId } = attributes || {};

            return <Text size="md" text={`#${invoiceId}`} />;
          },
          value: 'invoiceId',
          isSort: true,
        },
        {
          header: 'Name',
          accessor: (invoice: TInvoiceDataResponse) => {
            const { attributes: invoiceAttributes } = invoice || {};
            const { customer } = invoiceAttributes || {};
            const { data } = customer || {};
            const { attributes: customerAttributes } = data || {};

            const { avatar = '', fullName = '' } = customerAttributes || {};

            return (
              <div className="flex gap-3.5 items-center h-[40px]">
                <ImageFallback
                  src={avatar}
                  alt="customer avatar"
                  width={40}
                  height={40}
                  sizes="40px"
                  className="rounded-full h-full object-cover"
                />
                <Text
                  size="md"
                  text={fullName}
                  className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                />
              </div>
            );
          },
          value: 'customer.fullName',
          isSort: true,
        },
        {
          header: 'Email',
          accessor: (invoice: TInvoiceDataResponse) => {
            const { attributes: invoiceAttributes } = invoice || {};
            const { email = '' } = invoiceAttributes || {};

            return (
              <div className="flex gap-2.5 items-center">
                <EmailIcon className="text-blue-500 dark:text-purple-600" />
                <Link href={`mailto:${email}`}>
                  <Text
                    size="md"
                    text={email}
                    className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                  />
                </Link>
              </div>
            );
          },
          value: 'email',
          isSort: true,
        },
        {
          header: 'Date',
          accessor: (invoice: TInvoiceDataResponse) => {
            const { attributes: invoiceAttributes } = invoice || {};
            const { date = '' } = invoiceAttributes || {};

            return (
              <div className="flex gap-2.5 items-center">
                <CalendarIcon
                  width={13}
                  height={14}
                  className="text-teal-500 dark:text-teal-300"
                />
                <Text
                  size="md"
                  text={dayjs(date).format(DAYJS_PATTERN['DD MMM, YYYY'])}
                  className="text-nowrap"
                />
              </div>
            );
          },
          value: 'date',
          isSort: true,
        },
        {
          header: 'Status',
          accessor: (invoice: TInvoiceDataResponse) => {
            const { attributes: invoiceAttributes } = invoice || {};
            const { status = InvoiceStatus.Pending } = invoiceAttributes || {};

            return <InvoiceStatusComponent variant={status} />;
          },
          value: 'status',
          isSort: true,
        },
        {
          accessor: (invoice: TInvoiceDataResponse) => {
            const { attributes: invoiceAttributes, id } = invoice || {};
            const { isSelected = false } = invoiceAttributes || {};

            return (
              <StarButton
                id={id}
                isSelected={isSelected}
                onClick={onToggleSelectStar}
              />
            );
          },
        },
        {
          ...(isAdmin && {
            header: (
              <Button
                data-testid="multiple-delete-btn"
                isIconOnly
                isDisabled={!selectedInvoiceIds.length}
                className="w-20 h-10 bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent"
                onClick={handleOpenConfirmModal}
              >
                <MdDelete
                  aria-label="Delete Button"
                  size={20}
                  className="text-blue-800/30 dark:text-white/40"
                />
              </Button>
            ),

            accessor: (invoice: TInvoiceDataResponse) => {
              const { id } = invoice || {};

              return (
                <DropdownActions
                  id={id}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              );
            },
          }),
        },
      ].filter((item) => Object.keys(item).length !== 0),
    [
      handleDelete,
      handleOpenConfirmModal,
      isAdmin,
      onEdit,
      onToggleSelectStar,
      selectedInvoiceIds.length,
    ],
  );

  const handleSelectChange = useCallback(
    (keys: Selection) => {
      const ids =
        typeof keys === 'string'
          ? data.map((invoice) => invoice.id)
          : Array.from(keys).map(Number);

      setSelectedInvoiceIds(ids);
    },
    [data],
  );

  return (
    <div className="flex flex-col gap-10">
      <Table
        selectionMode={isAdmin ? 'multiple' : 'none'}
        columns={mappingContentColumns}
        data={data}
        sortBy={sortBy}
        order={order}
        onSort={onSort}
        onSelectChange={handleSelectChange}
        onRowAction={onRowAction}
      />

      {pageCount > 0 && <Pagination total={pageCount} />}

      {isModalOpen && (
        <ConfirmModal
          title="Delete Item"
          content="Are you sure you want to delete these items?"
          isOpen={isModalOpen}
          onConfirm={handleConfirmDeleteMultiple}
          onCancel={handleCancelDeleteMultiple}
        />
      )}
    </div>
  );
};

export default withAccountState<TInvoicesTableProps>(
  memo(InvoicesTable, isEqual),
);
