'use client';
import { memo } from 'react';
import isEqual from 'react-fast-compare';

// Models
import { ICustomer, IProduct, TInvoice, TInvoiceProduct } from '@/models';

// Types
import { TInvoiceProductTable } from '@/types';

// Components
import { InvoiceForm } from '@/components';

interface EditInvoiceClientProps {
  invoice: TInvoice & { id: number };
  invoiceProducts: TInvoiceProductTable[];
  products: (IProduct & { id: number })[];
  customers: (ICustomer & { id: number })[];
  onEditInvoice: (
    id: number,
    data: Partial<TInvoice>,
    products: TInvoiceProduct<IProduct & { id: number }>[],
  ) => Promise<{
    error?: string;
    success?: boolean;
  }>;
}

const EditInvoiceClient = ({
  invoice,
  invoiceProducts,
  customers,
  products,
  onEditInvoice,
}: EditInvoiceClientProps) => {
  const handleEditInvoice = (
    data: Partial<TInvoice>,
    products: TInvoiceProduct<IProduct & { id: number }>[],
  ) => onEditInvoice(invoice.id, data, products);

  return (
    <div className="bg-white dark:bg-gray-400 p-[30px] pb-[60px] rounded-[10px] h-[calc(full-60px)] flex w-full justify-center">
      <InvoiceForm
        isEdit
        invoiceId={invoice.invoiceId ?? ''}
        previewData={invoice}
        previewInvoiceProducts={invoiceProducts}
        onSubmit={handleEditInvoice}
        products={products}
        customers={customers}
      />
    </div>
  );
};

export default memo(EditInvoiceClient, isEqual);
