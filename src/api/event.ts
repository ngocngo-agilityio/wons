// Constants
import { API_PATH } from '@/constants';

// Models
import { IEvent } from '@/models';

// Services
import { httpClient } from '@/services';

// Types
import { StrapiModel, StrapiResponse } from '@/types';

// Utils
import { formatErrorMessage } from '@/utils';

export const getEvents = async (): Promise<{
  error?: string;
  data?: StrapiModel<IEvent>[];
}> => {
  try {
    const productsResponse = await httpClient.getRequest<
      StrapiResponse<StrapiModel<IEvent>[]>
    >({
      endpoint: `${API_PATH.EVENTS}?populate=users_permissions_users`,
      configOptions: {
        next: {
          tags: [API_PATH.EVENTS],
        },
      },
    });

    if (!productsResponse?.data?.length) {
      return { data: [] };
    }

    return { data: productsResponse.data };
  } catch (error) {
    const message = formatErrorMessage(error);
    return { error: message };
  }
};
