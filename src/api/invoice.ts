// Constants
import { API_PATH, PAGE_SIZE } from '@/constants';

// Models
import { IProduct, TInvoiceProduct } from '@/models';

// Types
import { StrapiModel, StrapiResponse, TInvoiceListResponse } from '@/types';

// Utils
import { formatFilterIntervalDate } from '@/utils';

// Services
import { httpClient } from '@/services';

// Utils
import { formatErrorMessage } from '@/utils';

interface IParameters {
  cache?: RequestCache;
  nextOptions?: NextFetchRequestConfig;
  sort?: string;
  filters?: Record<string, string>;
}

export const getInvoiceProducts = async ({
  cache,
  nextOptions,
  sort,
  filters,
}: IParameters) => {
  const sortValue: string = sort ? `&sort=${sort}` : '';
  const filterQuery: string = formatFilterIntervalDate(
    filters as Record<string, string>,
  );

  const endpoint: string = `${API_PATH.INVOICE_PRODUCTS}?populate=product&
                            pagination[pageSize]=${PAGE_SIZE[4]}
                            ${sortValue}${filterQuery}`;
  try {
    const response = await httpClient.getRequest<
      StrapiResponse<StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>[]>
    >({
      endpoint: endpoint,
      configOptions: {
        cache: cache ?? 'force-cache',
        next: nextOptions,
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const getInvoices = async ({ cache, nextOptions }: IParameters) => {
  const endpoint: string = `${API_PATH.INVOICES}?populate=customer`;

  try {
    const response = await httpClient.getRequest<TInvoiceListResponse>({
      endpoint,
      configOptions: {
        cache: cache ?? 'force-cache',
        next: nextOptions,
      },
    });

    return response;
  } catch (error) {
    const message = formatErrorMessage(error);

    throw new Error(message);
  }
};
