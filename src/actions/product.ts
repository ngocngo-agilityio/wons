'use server';

import { revalidateTag } from 'next/cache';

// Constants
import { API_PATH } from '@/constants';

// Models
import { IProductDetail } from '@/models';

// Services
import { httpClient } from '@/services';

// Utils
import { formatErrorMessage } from '@/utils';

// Types
import { TProductInvoiceListResponse, Method } from '@/types';

export const createProduct = async (formData: Partial<IProductDetail>) => {
  try {
    await httpClient.genericRequest({
      method: Method.Post,
      endpoint: API_PATH.PRODUCTS,
      body: {
        data: formData,
      },
    });

    revalidateTag(API_PATH.PRODUCTS);
    revalidateTag(API_PATH.INVOICE_PRODUCTS);

    return { success: true };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};

export const updateProduct = async (
  formData: Partial<IProductDetail>,
  id: number,
) => {
  try {
    await httpClient.genericRequest({
      method: Method.Put,
      endpoint: `${API_PATH.PRODUCTS}/${id}`,
      body: {
        data: formData,
      },
    });

    revalidateTag(API_PATH.PRODUCTS);
    revalidateTag(API_PATH.INVOICE_PRODUCTS);

    return { success: true };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const { data: responseInvoiceProducts }: TProductInvoiceListResponse =
      await httpClient.getRequest({
        endpoint: `${API_PATH.INVOICE_PRODUCTS}?filters[product][$eq]=${id}`,
      });

    const queryString = responseInvoiceProducts
      ?.map(
        (item, index) =>
          `filters[$or][${index}][invoice_products][id]=${item.id}`,
      )
      .join('&');

    responseInvoiceProducts?.forEach(async (invoice) => {
      return await httpClient.genericRequest({
        method: Method.Delete,
        endpoint: `${API_PATH.INVOICE_PRODUCTS}/${invoice.id}`,
      });
    });

    if (queryString) {
      const responseInvoices: TProductInvoiceListResponse =
        await httpClient.getRequest({
          endpoint: `${API_PATH.INVOICES}?${queryString}`,
        });

      responseInvoices?.data?.forEach(async (invoice) => {
        await httpClient.genericRequest({
          method: Method.Delete,
          endpoint: `${API_PATH.INVOICES}/${invoice.id}`,
        });
      });
    }

    await httpClient.genericRequest({
      method: Method.Delete,
      endpoint: `${API_PATH.PRODUCTS}/${id}`,
    });

    revalidateTag(API_PATH.INVOICE_PRODUCTS);
    revalidateTag(API_PATH.INVOICES);
    revalidateTag(API_PATH.PRODUCTS);

    return { success: true };
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};
