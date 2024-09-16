'use server';

// Libs
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

export const createInvoiceAction = async (
  formData: Partial<TInvoice>,
  products: number[],
) => {
  try {
    if (formData.imageUrl) {
      const imageFormData = new FormData();
      imageFormData.append('file', formData.imageUrl);
      console.log('imageFormData', imageFormData);
      const imageUrl = await uploadImage(imageFormData);

      if (typeof imageUrl === 'string') {
        formData.imageUrl = imageUrl;

        console.log('formattedData', formData.imageUrl);
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

    console.log('formattedData', formattedData);

    // await httpClient.postRequest({
    //   endpoint: API_PATH.INVOICES,
    //   body: { data: formattedData },
    // });

    return { success: true };
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
