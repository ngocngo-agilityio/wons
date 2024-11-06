import { notFound } from 'next/navigation';

// Api
import { getInvoiceById } from '@/api';

// Models
import { IProduct, TInvoiceProduct } from '@/models';

// Types
import { StrapiModel } from '@/types';

// Components
import {
  InvoiceDetailsHeader,
  InvoiceDetailsBody,
  InvoiceDetailsFooter,
} from '@/ui/invoice-details';

interface IInvoiceDetailsSectionProps {
  id: number;
}

const InvoiceDetailsSection = async ({ id }: IInvoiceDetailsSectionProps) => {
  const { data } = await getInvoiceById({
    id: id,
  });
  const invoices: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>[] =
    data?.attributes?.invoice_products?.data;
  const { address = '', email = '', date = '' } = data?.attributes ?? {};
  const { phone = '', fullName = '' } =
    data?.attributes?.customer?.data?.attributes ?? {};

  if (!data) notFound();

  return (
    <div className="max-w-[1440px] m-auto base:px-2 base:py-5 lg:p-7.5 bg-white dark:bg-gray-400 rounded-10">
      <InvoiceDetailsHeader
        fullName={fullName}
        email={email}
        address={address}
        phone={phone}
        date={date}
      />
      <InvoiceDetailsBody data={invoices} />
      <InvoiceDetailsFooter />
    </div>
  );
};

export default InvoiceDetailsSection;
