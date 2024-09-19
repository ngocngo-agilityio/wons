'use server';

import { revalidateTag } from 'next/cache';

// APIs
import { uploadImage } from '@/api/image';

// Constants
import { API_PATH } from '@/constants';

// Models
import { TInvoice } from '@/models';

// Services
import { httpClient } from '@/services';

// Utils
import { formatErrorMessage } from '@/utils';

export const createInvoice = async (
  formData: Partial<TInvoice>,
  products: number[],
) => {
  try {
    if (formData.imageUrl) {
      const imageFormData = new FormData();
      imageFormData.append('image', formData.imageUrl);
      const imageUrl = await uploadImage(imageFormData);

      if (typeof imageUrl === 'string') {
        formData.imageUrl = imageUrl;
      } else {
        return { error: imageUrl.error };
      }
    }

    const formattedData = {
      ...formData,
      customer: Number(formData.customer),
      isSelected: false,
      invoice_products: products,
    };

    await httpClient.postRequest({
      endpoint: API_PATH.INVOICES,
      body: { data: formattedData },
    });

    revalidateTag(API_PATH.INVOICES);

    return { success: true };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};

export const editInvoice = async (
  id: number,
  newData: Partial<TInvoice>,
  newProducts: number[],
) => {
  try {
    const data = {
      ...newData,
      customer: Number(newData.customer),
      invoice_products: newProducts,
    };

    await httpClient.putRequest({
      endpoint: `${API_PATH.INVOICES}/${id}`,
      body: { data },
    });

    revalidateTag(API_PATH.INVOICES);
    revalidateTag(API_PATH.INVOICE);

    return { success: true };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};

export const updateInvoice = async (id: number, data: Partial<TInvoice>): Promise<{ error?: string } | void> => {
  try {
    await httpClient.putRequest({
      endpoint: `${API_PATH.INVOICES}/${id}`,
      body: { data },
    });

    revalidateTag(API_PATH.INVOICES);
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};

export const deleteInvoice = async (
  id: number,
): Promise<{ error?: string } | void> => {
  try {
    await httpClient.deleteRequest({
      endpoint: `${API_PATH.INVOICES}/${id}`,
    });

    revalidateTag(API_PATH.INVOICES);
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};

export const deleteMultipleInvoice = async (
  ids: number[],
): Promise<{ error?: string } | void> => {
  try {
    await Promise.all(
      ids.map((id) =>
        httpClient.deleteRequest({
          endpoint: `${API_PATH.INVOICES}/${id}`,
        }),
      ),
    );

    revalidateTag(API_PATH.INVOICES);
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};
