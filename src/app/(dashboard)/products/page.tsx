import { Metadata } from 'next';
import { Suspense } from 'react';

// Components
import { DateRangePicker, ProductDrawer } from '@/components';

// Constants
import { DEFAULT_PAGE, IMAGES, PAGE_TITLES } from '@/constants';

// Layouts
import { DashBoardLayout } from '@/layouts';

// UIs
import { ProductList, ProductListSkeleton } from '@/ui/product-list';

// Types
import { ISearchParams } from '@/types';

export const metadata: Metadata = {
  title: 'Wons Product',
  description:
    'Browse the list of all products, including titles, contact price, and branch, description. Stay connected and access essential products information.',
  openGraph: {
    title: 'Wons Product',
    description:
      'Browse the list of all products, including titles, contact price, and branch, description. Stay connected and access essential products information.',
    images: [
      {
        url: IMAGES.PREVIEW_IMAGE,
        alt: 'preview image',
      },
    ],
  },
};

type TInvoiceListPageProps = {
  searchParams: ISearchParams;
};

const ProductListPage = ({
  searchParams = {},
}: TInvoiceListPageProps): JSX.Element => {
  const { page = DEFAULT_PAGE, startTime = '', endTime = '' } = searchParams;

  return (
    <DashBoardLayout
      title={PAGE_TITLES.PRODUCT}
      rightContent={<DateRangePicker />}
    >
      <ProductDrawer />
      <Suspense
        key={page + startTime + endTime}
        fallback={<ProductListSkeleton />}
      >
        <ProductList searchParams={searchParams} />
      </Suspense>
    </DashBoardLayout>
  );
};

export default ProductListPage;
