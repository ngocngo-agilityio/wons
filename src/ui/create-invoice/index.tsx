// Actions
import { createInvoice } from '@/actions';

// Api
import { getCustomers, getProducts } from '@/api';

// Utils
import { formattedResponseData, generateRandomID } from '@/utils';

// Components
import { InvoiceForm } from '@/components';

const CreateInvoice = async () => {
  const { data: products = [] } = await getProducts();
  const { data: customers = [] } = await getCustomers();

  return (
    <div className="bg-white dark:bg-gray-400 p-[30px] pb-[70px] rounded-[10px] h-[calc(full-60px)] flex w-full justify-center">
      <InvoiceForm
        invoiceId={generateRandomID()}
        onSubmit={createInvoice}
        products={formattedResponseData(products ?? [])}
        customers={formattedResponseData(customers ?? [])}
      />
    </div>
  );
};

export default CreateInvoice;
