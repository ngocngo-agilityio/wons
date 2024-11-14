// constants
import { API_PATH } from '@/constants';

// models
import { IProduct } from '@/models';

// types
import { StrapiModel, StrapiResponse } from '@/types/strapi';

// services
import { httpClient } from '@/services';

// utils
import { formatErrorMessage } from '@/utils';

export const getAllProducts = async ({
  limitNumber,
}: {
  limitNumber: number;
}): Promise<{
  error?: string;
  data?: StrapiModel<IProduct>[];
}> => {
  const url = `${API_PATH.PRODUCTS}?sort=rating:desc&pagination[limit]=${limitNumber}`;

  try {
    const productsResponse = await httpClient.getRequest<
      StrapiResponse<StrapiModel<IProduct>[]>
    >({
      endpoint: url,
      configOptions: {
        next: {
          tags: [API_PATH.PRODUCTS],
        },
      },
    });

    return { data: productsResponse.data ?? [] };
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};

export const getProducts = async (): Promise<{
  error?: string;
  data?: StrapiModel<IProduct>[];
}> => {
  try {
    const productsResponse = await httpClient.getRequest<
      StrapiResponse<StrapiModel<IProduct>[]>
    >({
      endpoint: API_PATH.PRODUCTS,
      configOptions: {
        next: {
          tags: [API_PATH.PRODUCTS],
        },
      },
    });

    return { data: productsResponse.data ?? [] };
  } catch (error) {
    const message = formatErrorMessage(error);

    return { error: message };
  }
};
