import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';

// Constants
import { API_PATH, ROUTES } from '@/constants';

// Layouts
import { DashBoardLayout } from '@/layouts';

// UI
import { InvoiceDetailsSection, InvoiceDetailsSkeleton } from '@/ui';

// Services
import { httpClient } from '@/services';

// Types
import { TInvoiceDetailsResponse } from '@/types';

interface IInvoiceDetailsPageProps {
  params: { id: number };
}

export async function generateMetadata(
  { params }: IInvoiceDetailsPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id: number = params.id;
  const result: TInvoiceDetailsResponse =
    await httpClient.getRequest<TInvoiceDetailsResponse>({
      endpoint: `${API_PATH.INVOICES}/${id}?populate=customer&populate=invoice_products&populate=invoice_products.product`,
    });

  const { imageUrl, customer, invoiceId } = result?.data?.attributes ?? {};

  const nameCustomer = customer?.data?.attributes?.fullName;

  // Optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Invoice ID: ${invoiceId}`,
    description: `${nameCustomer} invoice details about id, products, title,...`,
    openGraph: {
      images: [imageUrl, ...previousImages],
      title: `Invoice ID: ${invoiceId}`,
      description: `${nameCustomer} invoice details about id, products, title,...`,
    },
  };
}

const InvoiceDetailsPage = ({ params }: IInvoiceDetailsPageProps) => {
  const id: number = params.id;

  return (
    <main>
      <DashBoardLayout title="Invoice Details">
        <Suspense
          key={`${ROUTES.INVOICE}/${id}`}
          fallback={<InvoiceDetailsSkeleton />}
        >
          <InvoiceDetailsSection id={id} />
        </Suspense>
      </DashBoardLayout>
    </main>
  );
};

export default InvoiceDetailsPage;
