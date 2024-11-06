// Actions
import { editInvoice } from '@/actions';

// Api
import { getCustomers, getInvoiceById, getProducts } from '@/api';

// Utils
import { formattedResponseData } from '@/utils';

// Components
import EditInvoiceClient from '../EditInvoiceClient';

interface EditInvoiceProps {
  id: number;
}

const EditInvoice = async ({ id }: EditInvoiceProps) => {
  const [{ data: products }, { data: customers }, { data: invoice }] =
    await Promise.all([
      getProducts(),
      getCustomers(),
      getInvoiceById({
        id,
      }),
    ]);

  const productInvoice = formattedResponseData(
    invoice?.attributes?.invoice_products?.data || [],
  );

  const formattedPreviewProduct = productInvoice.map((data) => {
    const { id, price, quantity, product } = data;

    return {
      id,
      price,
      quantity,
      product: {
        data: {
          id: product.data.id,
          ...product.data.attributes,
        },
      },
    };
  });

  const formattedInvoice = {
    ...invoice?.attributes,
    id: invoice?.id,
    customerId: invoice?.attributes?.customer?.data?.id.toString() ?? '',
  };

  return (
    <EditInvoiceClient
      invoice={formattedInvoice}
      invoiceProducts={formattedPreviewProduct}
      products={formattedResponseData(products ?? [])}
      customers={formattedResponseData(customers ?? [])}
      onEditInvoice={editInvoice}
    />
  );
};

export default EditInvoice;
