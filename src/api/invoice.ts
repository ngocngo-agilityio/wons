// Constants
import { API_PATH, DEFAULT_PAGE, PAGE_SIZE, TIME_BASE } from '@/constants';

// Types
import {
  TInvoiceDetailsResponse,
  TInvoiceListResponse,
  TInvoiceProductData,
  TRecentInvoiceProductResponse,
} from '@/types';

// Utils
import { formatFilterIntervalDate, formatErrorMessage } from '@/utils';

// Services
import { httpClient } from '@/services';

interface IParameters {
  sort?: string;
  filters?: Record<string, string>;
  pageSize?: number;
}

export interface InvoiceListConfigs {
  query?: string;
  sortOrder?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
  id?: number;
}

export const getInvoiceProducts = async ({
  sort,
  filters,
  pageSize = PAGE_SIZE[4],
}: IParameters): Promise<{
  error?: string;
  data?: TInvoiceProductData;
}> => {
  const sortValue: string = sort ? `&sort=${sort}` : '';

  const filterQuery: string = formatFilterIntervalDate(
    filters as Record<string, string>,
  );
  const endpoint: string = `${API_PATH.INVOICE_PRODUCTS}?populate=product&pagination[page]=${DEFAULT_PAGE}&pagination[pageSize]=${pageSize}${sortValue}${filterQuery}`;

  try {
    const response = await httpClient.getRequest<TRecentInvoiceProductResponse>(
      {
        endpoint: endpoint,
        configOptions: {
          next: {
            tags: [API_PATH.INVOICE_PRODUCTS],
            revalidate: TIME_BASE[3600],
          },
        },
      },
    );

    return { data: response.data ?? [] };
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};

export const getInvoices = async ({
  query,
  sortOrder,
  sortBy,
  page = DEFAULT_PAGE,
  pageSize = PAGE_SIZE[10],
}: InvoiceListConfigs = {}): Promise<TInvoiceListResponse> => {
  const sortValue = sortBy ? `&sort=${sortBy}:${sortOrder}` : '';
  const searchBy = query
    ? `&filters[$or][0][customer][fullName][$containsi]=${query}&filters[$or][1][email][$containsi]=${query}`
    : '';
  const pageValue = `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  const endpoint: string = `${API_PATH.INVOICES}?populate=customer&populate=invoice_products${sortValue}${searchBy}${pageValue}`;

  try {
    const response = await httpClient.getRequest<TInvoiceListResponse>({
      endpoint,
      configOptions: {
        next: { tags: [API_PATH.INVOICES], revalidate: TIME_BASE[3600] },
      },
    });

    return response;
  } catch (error) {
    const message = formatErrorMessage(error);

    throw new Error(message);
  }
};

export const getInvoiceById = async ({ id }: InvoiceListConfigs) => {
  const endpoint = `${API_PATH.INVOICES}/${id}?populate=customer&populate=invoice_products&populate=invoice_products.product`;

  try {
    const response = await httpClient.getRequest<TInvoiceDetailsResponse>({
      endpoint,
      configOptions: {
        next: { tags: [API_PATH.INVOICE], revalidate: TIME_BASE[3600] },
      },
    });

    return response;
  } catch (error) {
    const message = formatErrorMessage(error);

    throw new Error(message);
  }
};
