import Link from 'next/link';
import { Key, memo, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Utils
import { formatPhoneNumberTyping } from '@/utils';

// Types
import { TCustomerDataResponse } from '@/types';

// Hocs
import { withAccountState } from '@/hocs/withAccountState';

// Components
import {
  Table,
  Text,
  DropdownActions,
  GenderStatusComponent,
  ImageFallback,
} from '@/components';

const Pagination = dynamic(() => import('@/components/common/Pagination'));

type TCustomerData = TCustomerDataResponse;

type CustomersTableProps = {
  data: TCustomerData[];
  pageCount: number;
  sortBy?: string;
  order?: string;
  isAdmin: boolean;
  onEdit: (id: number) => void;
  onSort: (field: string) => void;
  onDelete: (id: number) => void;
  onRowAction?: (key: Key) => void;
};

const CustomersTable = ({
  data = [],
  pageCount,
  sortBy = '',
  order = '',
  isAdmin,
  onEdit,
  onSort,
  onDelete,
  onRowAction,
}: CustomersTableProps): JSX.Element => {
  const mappingContentColumns = useMemo(
    () =>
      [
        {
          header: 'Name',
          accessor: (customerData: TCustomerData) => {
            const { attributes } = customerData || {};
            const {
              avatar = '',
              firstName = '',
              lastName = '',
            } = attributes || {};

            return (
              <div className="flex gap-3.5 items-center h-[40px]">
                <ImageFallback
                  width={40}
                  height={40}
                  src={avatar}
                  alt="customer avatar"
                  className="rounded-full h-full object-cover"
                  sizes="40px"
                />
                <Text
                  size="md"
                  text={`${firstName} ${lastName}`}
                  className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                />
              </div>
            );
          },
          isSort: true,
          value: 'fullName',
        },
        {
          header: 'Email',
          accessor: (customerData: TCustomerData) => {
            const { attributes } = customerData || {};
            const { email = '' } = attributes || {};

            return (
              <div className="flex gap-2.5 items-center">
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
          isSort: true,
          value: 'email',
        },
        {
          header: 'Phone Number',
          accessor: (customerData: TCustomerData) => {
            const { attributes } = customerData || {};
            const { phone = '' } = attributes || {};

            return (
              <Link href={`tel:${phone}`}>
                <Text
                  size="md"
                  text={formatPhoneNumberTyping(phone)}
                  className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                />
              </Link>
            );
          },
          isSort: true,
          value: 'phone',
        },
        {
          header: 'Gender',
          accessor: (customerData: TCustomerData) => {
            const { attributes } = customerData || {};
            const gender = attributes?.gender || 'male';

            return (
              <GenderStatusComponent gender={gender as 'male' | 'female'} />
            );
          },
          isSort: true,
          value: 'gender',
        },
        {
          ...(isAdmin && {
            accessor: (customerData: TCustomerData) => {
              const { id } = customerData || {};

              return (
                <DropdownActions id={id} onEdit={onEdit} onDelete={onDelete} />
              );
            },
          }),
        },
      ].filter((item) => Object.keys(item).length !== 0),
    [isAdmin, onDelete, onEdit],
  );

  return (
    <div className="flex flex-col gap-10">
      <Table
        onSort={onSort}
        columns={mappingContentColumns}
        data={data}
        sortBy={sortBy}
        order={order}
        onRowAction={onRowAction}
      />

      {pageCount > 0 && <Pagination total={pageCount} />}
    </div>
  );
};

export default withAccountState<CustomersTableProps>(memo(CustomersTable));
