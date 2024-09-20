// apis
import { getCustomers } from '@/api';

// constants
import { API_PATH } from '@/constants';

// uis
import { CustomerListClient } from '@/ui';

type TCustomerListProps = {
  page?: number;
};

const CustomerList = async ({ page }: TCustomerListProps) => {
  const { data: customerRes, meta } = await getCustomers({
    page,
    nextOptions: { tags: [API_PATH.CUSTOMERS] },
  });

  const { pagination } = meta || {};
  const { pageCount = 0 } = pagination || {};

  return (
    <CustomerListClient customerList={customerRes} pageCount={pageCount} />
  );
};

export default CustomerList;
