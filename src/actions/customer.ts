'use server';

import { revalidateTag } from 'next/cache';

// Services
import { httpClient } from '@/services';

// Models
import { ICustomer } from '@/models';

// Utils
import { formatErrorMessage } from '@/utils';

// Constants
import { API_PATH } from '@/constants';

// Types
import { TInvoiceListResponse } from '@/types';

export const createCustomer = async (formData: Partial<ICustomer>) => {
  try {
    const formattedData = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
    };

    await httpClient.postRequest({
      endpoint: API_PATH.CUSTOMERS,
      body: { data: formattedData },
    });

    revalidateTag(API_PATH.CUSTOMERS);

    return { success: true };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};

export const deleteCustomer = async (id: number) => {
  try {
    const response: TInvoiceListResponse = await httpClient.getRequest({
      endpoint: `${API_PATH.INVOICES}?filters[customer][$eq]=${id}`,
    });

    response.data.map(async (invoice) => {
      return await httpClient.deleteRequest({
        endpoint: `${API_PATH.INVOICES}/${invoice.id}`,
      });
    });

    await httpClient.deleteRequest({
      endpoint: `${API_PATH.CUSTOMERS}/${id}`,
    });

    revalidateTag(API_PATH.CUSTOMERS);
    revalidateTag(API_PATH.INVOICES);

    return { success: true };
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};

export const updateCustomer = async (
  id: number,
  data: Partial<ICustomer>,
): Promise<{ error?: string }> => {
  try {
    await httpClient.putRequest({
      endpoint: `${API_PATH.CUSTOMERS}/${id}`,
      body: { data },
    });

    revalidateTag(API_PATH.CUSTOMERS);

    return { error: undefined };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};
