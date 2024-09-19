import { Metadata } from 'next';
import { Suspense } from 'react';

// layouts
import { DashBoardLayout } from '@/layouts';

// uis
import { CustomerList } from '@/ui';

// components
import { CustomerDrawerWrapper, TableSkeleton } from '@/components';

// constants
import { MAPPING_CUSTOMER_LIST_SKELETON } from '@/constants/skeleton';
import { DEFAULT_PAGE } from '@/constants';

// types
import { ISearchParams } from '@/types';

export const metadata: Metadata = {
  title: 'Customer Directory - View All Customers',
  description:
    'Browse the list of all customers, including names, contact emails, and genders, phone numbers. Stay connected and access essential customers information.',
};

type TInvoiceListPageProps = {
  searchParams: ISearchParams;
};

const CustomerListPage = ({
  searchParams,
}: TInvoiceListPageProps): JSX.Element => {
  const { page = DEFAULT_PAGE } = searchParams || {};

  return (
    <main>
      <DashBoardLayout
        title="Customer List"
        rightContent={<CustomerDrawerWrapper />}
      >
        <Suspense
          key={page}
          fallback={
            <TableSkeleton
              variant="primary"
              isStriped={false}
              columns={MAPPING_CUSTOMER_LIST_SKELETON}
            />
          }
        >
          <CustomerList page={+page} />
        </Suspense>
      </DashBoardLayout>
    </main>
  );
};

export default CustomerListPage;
