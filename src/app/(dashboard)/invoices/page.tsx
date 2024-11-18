import { Metadata } from 'next';
import { Suspense } from 'react';

// Constants
import { DEFAULT_PAGE, IMAGES, PAGE_TITLES } from '@/constants';

// Types
import { ISearchParams } from '@/types';

// Layouts
import { DashBoardLayout } from '@/layouts';

// Sections
import { InvoiceListActions, InvoiceList, InvoiceListSkeleton } from '@/ui';

export const metadata: Metadata = {
  title: 'Wons Invoice',
  description:
    'Manage all invoices, go to create, edit and invoice details page, and delete one or more products',
  openGraph: {
    title: 'Wons Invoice',
    description:
      'Manage all invoices, go to create, edit and invoice details page, and delete one or more products',
    images: [
      {
        url: IMAGES.PREVIEW_IMAGE,
        alt: 'preview image',
      },
    ],
  },
};

export type TInvoiceListPageProps = {
  searchParams: ISearchParams;
};

const InvoiceListPage = ({
  searchParams,
}: TInvoiceListPageProps): JSX.Element => {
  const {
    order = '',
    sortBy = '',
    query = '',
    page = DEFAULT_PAGE,
  } = searchParams || {};

  return (
    <DashBoardLayout
      title={PAGE_TITLES.INVOICE}
      rightContent={<InvoiceListActions />}
    >
      <Suspense
        key={order + sortBy + query + page}
        fallback={<InvoiceListSkeleton />}
      >
        <InvoiceList
          sortBy={sortBy}
          sortOrder={order}
          query={query}
          page={+page}
        />
      </Suspense>
    </DashBoardLayout>
  );
};

export default InvoiceListPage;
