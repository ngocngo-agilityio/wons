// Constants
import { API_PATH, DEFAULT_PAGE, ORDER, PAGE_SIZE } from '@/constants';

// Services
import { httpClient } from '@/services';

// Types
import { TCustomerListResponse } from '@/types';

// Utils
import { formatErrorMessage } from '@/utils';

interface CustomerListConfigs {
  id?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  order?: string;
  cache?: RequestCache;
}

export const getCustomers = async ({
  page = DEFAULT_PAGE,
  pageSize = PAGE_SIZE[10],
  sortBy,
  order,
}: CustomerListConfigs = {}): Promise<TCustomerListResponse> => {
  const sortValue = sortBy
    ? `&sort=${sortBy}:${order}`
    : `&sort=createdAt:${ORDER.DESC}`;
  const pageValue = `pagination[page]=${page}&pagination[pageSize]=${pageSize}${sortValue}`;

  const endpoint = `${API_PATH.CUSTOMERS}?${pageValue}`;

  try {
    const customerResponse = await httpClient.getRequest<TCustomerListResponse>(
      {
        endpoint,
        configOptions: {
          next: { tags: [API_PATH.CUSTOMERS] },
        },
      },
    );

    return customerResponse;
  } catch (error) {
    const message = formatErrorMessage(error);

    throw new Error(message);
  }
};
