// Apis
import { getCustomers } from '@/api';

// Constants
import { DEFAULT_PAGE } from '@/constants';

// UIs
import { CustomerListClient } from '@/ui';

type TCustomerListProps = {
  page?: number;
  sortBy?: string;
  order?: string;
};

const CustomerList = async ({
  page = DEFAULT_PAGE,
  sortBy = '',
  order = '',
}: TCustomerListProps) => {
  const { data: customerRes = [], meta } = await getCustomers({
    page,
    sortBy,
    order,
  });

  const { pagination } = meta || {};
  const { pageCount = 0 } = pagination || {};

  return (
    <CustomerListClient
      order={order}
      customerList={customerRes}
      pageCount={pageCount}
    />
  );
};

export default CustomerList;
